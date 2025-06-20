use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use ctypes::AppointmentStatus;
use database::queries::{self};
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

#[derive(Deserialize, ToSchema)]
#[schema(as = appointment::update_status::Request)]
pub struct Request {
    pub status: AppointmentStatus,
}

#[utoipa::path(
    post,
    tag = "Appointment",
    path = "/appointment/{id}",
    operation_id = "appointment::update_status",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    security(("jwt_token" = [])),
)]
pub async fn update_status(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<()> {
    let database = state.database_pool.get().await?;

    queries::appointment::update_status()
        .bind(&database, &request.status, &id)
        .await?;

    Ok(())
}
