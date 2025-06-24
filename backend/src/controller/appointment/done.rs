use std::sync::Arc;

use crate::error::Error;
use crate::util::auth::{Claims, authorize};
use crate::{error::Result, state::ApiState};
use axum::extract::{Path, State};
use ctypes::{AppointmentStatus, Role};
use database::queries::{self};
use uuid::Uuid;

#[utoipa::path(
    patch,
    tag = "Appointment",
    path = "/appointment/{id}/done",
    operation_id = "appointment::done",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    security(("jwt_token" = [])),
)]
pub async fn done(state: State<Arc<ApiState>>, claims: Claims, Path(id): Path<Uuid>) -> Result<()> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    if let Err(error) = queries::appointment::update_status()
        .bind(&database, &AppointmentStatus::Done, &id)
        .await
    {
        tracing::error!(?error, id =? id, "Failed to done appointment");

        return Err(Error::internal());
    }

    Ok(())
}
