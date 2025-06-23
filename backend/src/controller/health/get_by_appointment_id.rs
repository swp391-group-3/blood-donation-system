use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use ctypes::Role;
use database::queries::{self, health::Health};
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    get,
    tags = ["Health", "Appointment"],
    path = "/appointment/{id}/health",
    operation_id = "health::get_by_appoinment_id",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    responses(
        (status = Status::OK, body = Option<Health>)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_by_appointment_id(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(appointment_id): Path<Uuid>,
) -> Result<Json<Option<Health>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    match queries::health::get_by_appointment_id()
        .bind(&database, &appointment_id)
        .opt()
        .await
    {
        Ok(health) => Ok(Json(health)),
        Err(error) => {
            tracing::error!(?error, "Failed to get health");

            Err(Error::internal())
        }
    }
}
