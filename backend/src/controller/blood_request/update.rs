use std::{collections::HashSet, sync::Arc};

use axum::{
    extract::{Path, State},
    http::StatusCode,
};
use ctypes::{RequestPriority, Role};
use database::{
    client::Params,
    queries::{self, blood_request::UpdateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::{
        auth::{Claims, authorize},
        blood::get_compatible,
        notification::send,
        validation::ValidJson,
    },
};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = blood_request::update::Request)]
#[mapper(
    into(custom = "with_context"),
    ty = UpdateParams::<String>,
    add(field = id, ty = Uuid),
    add(field = staff_id, ty = Uuid)
)]
pub struct Request {
    pub priority: Option<RequestPriority>,
    #[validate(length(min = 1))]
    pub title: Option<String>,
    #[validate(range(min = 1))]
    pub max_people: Option<i32>,
}

#[utoipa::path(
    put,
    tag = "Blood Request",
    path = "/blood-request/{id}",
    operation_id = "blood_request::update",
    params(
        ("id" = Uuid, Path, description = "Blood request id")
    ),
    request_body = Request,
    security(("jwt_token" = []))
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
    ValidJson(request): ValidJson<Request>,
) -> Result<()> {
    let database = state.database().await?;
    let priority = request.priority;

    authorize(&claims, [Role::Staff], &database).await?;

    if let Err(error) = queries::blood_request::update()
        .params(&database, &request.with_context(id, claims.sub))
        .await
    {
        tracing::error!(?error, "Failed to update blood request");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Invalid blood request data".into())
            .build());
    }

    if priority != Some(RequestPriority::High) {
        return Ok(());
    }

    let blood_request = match queries::blood_request::get()
        .bind(&database, &claims.sub, &id)
        .one()
        .await
    {
        Ok(blood_request) => blood_request,
        Err(error) => {
            tracing::error!(?error, "Failed to get blood request");

            return Err(Error::internal());
        }
    };

    let accounts = match queries::account::get_by_role()
        .bind(&database, &Role::Donor)
        .all()
        .await
    {
        Ok(accounts) => accounts,
        Err(error) => {
            tracing::error!(?error, "Failed to get account list");

            return Err(Error::internal());
        }
    };

    let request_blood_groups: HashSet<_> = blood_request.blood_groups.iter().cloned().collect();

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
                    blood_request.title,
                    blood_request.max_people,
                    blood_request.start_time.format("%Y-%m-%d %H:%M"),
                    blood_request.end_time.format("%Y-%m-%d %H:%M"),
                );

                send(account, subject, body, &state.mailer).await?;
            }
        }
    }

    Ok(())
}
