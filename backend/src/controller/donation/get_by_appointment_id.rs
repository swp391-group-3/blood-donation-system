use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use ctypes::Role;
use database::queries::{self, donation::Donation};
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    get,
    tags = ["Appointment", "Donation"],
    path = "/appointment/{id}/donation",
    operation_id = "donation::get_by_appointment_id",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    responses(
        (status = Status::OK, body = Option<Donation>)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_by_appointment_id(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
) -> Result<Json<Option<Donation>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    match queries::donation::get_by_appointment_id()
        .bind(&database, &id)
        .opt()
        .await
    {
        Ok(donation) => Ok(Json(donation)),
        Err(error) => {
            tracing::error!(?error, "Failed to get donation");

            Err(Error::internal())
        }
    }
}
