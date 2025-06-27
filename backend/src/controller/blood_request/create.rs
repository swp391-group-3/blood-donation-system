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
            
            match queries::account::is_donatable()
                .bind(&database, &account.id)
                .one()
                .await
            {
                Ok(true) => {}
                Ok(false) => {
                    continue;
                }
                Err(error) => {
                    tracing::error!(?error, "Failed to check if account is donatable");
                    continue;
                }
            };

            if !request_blood_groups.is_disjoint(&get_compatible(*blood_group)) {
                let subject = "URGENT: Immediate Blood Donation Needed – Matches Your Blood Group"
                    .to_string();

                let body = format!(
                    "Dear {},\n\n\
                We are reaching out to you with great urgency.\n\n\
                A critical situation has arisen, and we are in immediate need of blood donations. \
                Your registered blood group matches the current emergency requirement.\n\n\
                Request Details:\n\
                - Title: {}\n\
                - Maximum People Needed: {}\n\
                - Timeframe: From {} to {}\n\n\
                If you are able and available to donate, your support could help save a life.\n\n\
                Please contact the donation center or respond to this email as soon as possible.\n\n\
                Thank you for your prompt attention and compassion.\n\n\
                Sincerely,\n\
                Blood Donation Team",
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
