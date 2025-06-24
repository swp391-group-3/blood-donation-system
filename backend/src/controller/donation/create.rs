use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use axum_valid::Valid;
use ctypes::{AppointmentStatus, Role};
use database::{
    client::Params,
    queries::{self, donation::CreateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = donation::create::Request)]
#[mapper(
    into(custom = "with_appointment_id"),
    ty = CreateParams,
    add(field = appointment_id, ty = Uuid)
)]
pub struct Request {
    pub r#type: ctypes::DonationType,
    #[validate(range(min = 1))]
    pub amount: i32,
}

#[utoipa::path(
    post,
    tags = ["Donation", "Appointment"],
    path = "/appointment/{id}/donation",
    operation_id = "donation::create",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    request_body = Request,
    responses(
        (status = Status::OK, body = Uuid)
    ),
    security(("jwt_token" = []))
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(appointment_id): Path<Uuid>,
    Valid(Json(request)): Valid<Json<Request>>,
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

    let donation_id = match queries::donation::create()
        .params(&transaction, &request.with_appointment_id(appointment_id))
        .one()
        .await
    {
        Ok(id) => Ok(Json(id)),
        Err(error) => {
            tracing::error!(?error, "Failed to create donation");

            Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid donation data".into())
                .build())
        }
    };

    if let Err(error) = queries::appointment::update_status()
        .bind(&transaction, &AppointmentStatus::Donated, &appointment_id)
        .await
    {
        tracing::error!(?error, id =? appointment_id, "Failed to set donated appointment");

        return Err(Error::internal());
    }

    if let Err(error) = transaction.commit().await {
        tracing::error!(?error, "Failed to commit transaction");

        return Err(Error::internal());
    }

    donation_id
}
