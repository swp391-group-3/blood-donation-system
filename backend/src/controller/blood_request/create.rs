use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use chrono::{DateTime, Utc};
use ctypes::{BloodGroup, RequestPriority, Role};
use database::{
    client::Params,
    queries::{self, blood_request::CreateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use std::collections::HashSet;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::{
        auth::{Claims, authorize},
        blood::get_compatible,
        notification::send,
    },
};

#[derive(Deserialize, ToSchema, Mapper, Clone)]
#[schema(as = blood_request::create::Request)]
#[mapper(
    into(custom = "with_staff_id"),
    ty = CreateParams::<String>,
    add(field = staff_id, ty = Uuid),
)]
pub struct Request {
    #[mapper(skip)]
    pub blood_groups: Vec<BloodGroup>,
    pub priority: RequestPriority,
    pub title: String,
    pub max_people: i32,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
}

#[utoipa::path(
    post,
    tag = "Blood Request",
    path = "/blood-request",
    operation_id = "blood_request::create",
    request_body = Request,
    responses(
        (status = Status::OK, body = Uuid)
    ),
    security(("jwt_token" = []))
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let mut database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    let transaction = match database.transaction().await {
        Ok(transaction) => transaction,
        Err(error) => {
            tracing::error!(?error, "Failed to create transaction");

            return Err(Error::internal());
        }
    };

    let id = match queries::blood_request::create()
        .params(&transaction, &request.clone().with_staff_id(claims.sub))
        .one()
        .await
    {
        Ok(id) => id,
        Err(error) => {
            tracing::error!(?error, "Failed to create blood request");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid blood request data".into())
                .build());
        }
    };

    for blood_group in &request.blood_groups {
        if let Err(error) = queries::blood_request::add_blood_group()
            .bind(&transaction, &id, blood_group)
            .await
        {
            tracing::error!(
                ?error,
                ?blood_group,
                request_id =? id,
                "Failed to add blood to request"
            );

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid blood group".into())
                .build());
        }
    }

    if let Err(error) = transaction.commit().await {
        tracing::error!(?error, "Failed to commit transaction");
    }

    if request.priority != RequestPriority::High {
        return Ok(Json(id));
    }

    let accounts = match queries::account::get_by_role()
        .bind(&database, &Role::Member)
        .all()
        .await
    {
        Ok(accounts) => accounts,
        Err(error) => {
            tracing::error!(?error, "Failed to get account list");

            return Err(Error::internal());
        }
    };

    let request_blood_groups: HashSet<_> = request.blood_groups.iter().cloned().collect();

    for account in &accounts {
        if let Some(ref blood_group) = account.blood_group {
            match queries::account::next_donatable_date()
                .bind(&database, &account.id)
                .one()
                .await
            {
                Ok(next_donatable_date) => {
                    let now = chrono::Utc::now().with_timezone(next_donatable_date.offset());
                    if next_donatable_date > now {
                        continue;
                    }
                }
                Err(error) => {
                    tracing::error!(?error, "Failed to check next donatable date of account");

                    continue;
                }
            }

            match queries::account::is_applied()
                .bind(&database, &account.id)
                .one()
                .await
            {
                Ok(true) => {
                    continue;
                }
                Err(error) => {
                    tracing::error!(
                        ?error,
                        "Failed to check if account is applied for an appointment"
                    );

                    continue;
                }
                _ => {}
            }

            if !request_blood_groups.is_disjoint(&get_compatible(*blood_group)) {
                let subject = "URGENT: Immediate Blood Donation Needed – Matches Your Blood Group"
                    .to_string();

                let body = format!(
                    "<html>
                    <body style=\"font-family: Arial, sans-serif; line-height: 1.6;\">
                        <p>Dear <strong>{}</strong>,</p>

                        <p style=\"color: #b71c1c;\"><strong>This is an urgent appeal for blood donation.</strong></p>

                        <p>Your registered blood group matches a high-priority request. Your contribution could save lives.</p>

                        <h3 style=\"margin-bottom: 0;\">📝 Request Details</h3>
                        <table border=\"1\" cellpadding=\"8\" cellspacing=\"0\" style=\"border-collapse: collapse; margin-top: 5px;\">
                            <tr style=\"background-color: #f2f2f2;\">
                                <th align=\"left\">Title</th>
                                <td>{}</td>
                            </tr>
                            <tr>
                                <th align=\"left\">People Needed</th>
                                <td>{}</td>
                            </tr>
                            <tr>
                                <th align=\"left\">Timeframe</th>
                                <td>{} → {}</td>
                            </tr>
                        </table>

                        <p>If you are eligible and available to donate, please contact your nearest donation center or reply to this email immediately.</p>

                        <p>Thank you for your kindness and swift response.</p>

                        <p>Sincerely,<br><strong>Blood Donation Team</strong></p>
                    </body>
                    </html>",
                    account.name,
                    request.title,
                    request.max_people,
                    request.start_time.format("%Y-%m-%d %H:%M"),
                    request.end_time.format("%Y-%m-%d %H:%M"),
                );

                send(account, subject, body, &state.mailer).await?;
            }
        }
    }

    Ok(Json(id))
}
