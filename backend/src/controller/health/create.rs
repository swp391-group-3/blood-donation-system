use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use ctypes::Role;
use database::{
    client::Params,
    queries::{self, health::CreateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[derive(Deserialize, ToSchema, Mapper)]
#[schema(as = health::create::Request)]
#[mapper(
    into(custom = "with_appointment_id"),
    ty = CreateParams::<String>,
    add(field = appointment_id, ty = Uuid)
)]
pub struct Request {
    pub temperature: f32,
    pub weight: f32,
    pub upper_blood_pressure: i32,
    pub lower_blood_pressure: i32,
    pub heart_rate: i32,
    pub is_good_health: bool,
    pub note: Option<String>,
}

#[utoipa::path(
    post,
    tags = ["Health", "Appointment"],
    path = "/appointment/{id}/health",
    operation_id = "health::create",
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
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    match queries::health::create()
        .params(&database, &request.with_appointment_id(appointment_id))
        .one()
        .await
    {
        Ok(id) => Ok(Json(id)),
        Err(error) => {
            tracing::error!(?error, "Failed to create health");

            Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Failed to create health".into())
                .build())
        }
    }
}
