use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::{
    client::Params,
    queries::{self, health::CreateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{error::Result, state::ApiState};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = health::create::Request)]
#[mapper(
    into(custom = "with_appointment_id"),
    ty = CreateParams::<String>,
    add(field = appointment_id, ty = Uuid)
)]
pub struct Request {
    // TODO: check the temperature range
    #[validate(range(min = 30., max = 45.))]
    pub temperature: f32,
    #[validate(range(exclusive_min = 0.))]
    pub weight: f32,
    // TODO: check blood pressure range
    #[validate(range(exclusive_min = 0))]
    pub upper_blood_pressure: i32,
    #[validate(range(exclusive_min = 0))]
    pub lower_blood_pressure: i32,
    // TODO: check heart pulse range
    #[validate(range(exclusive_min = 0))]
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
    Path(appointment_id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let database = state.database_pool.get().await?;

    let id = queries::health::create()
        .params(&database, &request.with_appointment_id(appointment_id))
        .one()
        .await?;

    Ok(Json(id))
}
