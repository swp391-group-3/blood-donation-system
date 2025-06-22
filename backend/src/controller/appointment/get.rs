use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::queries;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

use super::Appointment;

#[utoipa::path(
    get,
    tag = "Appointment",
    path = "/appointment/{id}",
    operation_id = "appointment::get",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    responses(
        (status = Status::OK, body = Appointment)
    ),
    security(("jwt_token" = []))
)]
pub async fn get(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<Json<Appointment>> {
    let database = state.database_pool.get().await?;

    let appointment = queries::appointment::get()
        .bind(&database, &id)
        .map(|raw| Appointment::from(raw))
        .one()
        .await?;

    Ok(Json(appointment))
}
