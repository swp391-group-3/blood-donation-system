use std::sync::Arc;

use axum::{Json, extract::State};
use chrono::{DateTime, Utc};
use ctypes::AppointmentStatus;
use database::queries::{self};
use model_mapper::Mapper;
use serde::Serialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState, util::jwt::Claims};

#[derive(Serialize, ToSchema, Mapper)]
#[mapper(from, ty = queries::appointment::GetByMemberId)]
pub struct Appointment {
    pub id: Uuid,
    pub request_id: Uuid,
    pub member_id: Uuid,
    pub status: AppointmentStatus,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
}

#[utoipa::path(
    get,
    tag = "Appointment",
    path = "/appointment",
    operation_id = "appointment::get_by_member_id",
    responses(
        (status = Status::OK, body = Appointment)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_by_member_id(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<Appointment>>> {
    let database = state.database_pool.get().await?;

    let appointments = queries::appointment::get_by_member_id()
        .bind(&database, &claims.sub)
        .map(Appointment::from)
        .all()
        .await?;

    Ok(Json(appointments))
}
