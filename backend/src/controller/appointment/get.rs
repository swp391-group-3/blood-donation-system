use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use ctypes::AppointmentStatus;
use database::queries::{self};
use model_mapper::Mapper;
use serde::Serialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

#[derive(Serialize, ToSchema, Mapper)]
#[mapper(from, ty = queries::appointment::Get)]
pub struct AppointmentDetail {
    pub id: Uuid,
    pub request_id: Uuid,
    pub member_id: Uuid,
    pub status: AppointmentStatus,
}

#[utoipa::path(
    post,
    tag = "Appointment",
    path = "/appointment/{id}",
    operation_id = "appointment::get",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    responses(
        (status = Status::OK, body = AppointmentDetail)
    ),
    security(("jwt_token" = []))
)]
pub async fn get(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<AppointmentDetail>> {
    let database = state.database_pool.get().await?;

    let appointment = queries::appointment::get()
        .bind(&database, &id)
        .map(AppointmentDetail::from)
        .one()
        .await?;

    Ok(Json(appointment))
}
