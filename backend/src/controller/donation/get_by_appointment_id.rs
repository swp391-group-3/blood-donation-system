use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::queries;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

use super::Donation;

#[utoipa::path(
    get,
    tags = ["Appointment", "Donation"],
    path = "/appointment/{id}/donation",
    operation_id = "donation::get_by_appointment_id",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    responses(
        (status = Status::OK, body = Donation)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_by_appointment_id(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<Option<Donation>>> {
    let database = state.database_pool.get().await?;

    let donation = queries::donation::get_by_appointment_id()
        .bind(&database, &id)
        .map(Donation::from_get_by_appointment_id)
        .opt()
        .await?;

    Ok(Json(donation))
}
