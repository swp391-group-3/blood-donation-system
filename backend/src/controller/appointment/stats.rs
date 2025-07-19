use std::sync::Arc;

use axum::{Json, extract::State};
use ctypes::Role;
use database::queries::{self, appointment::AppointmentStats};

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    get,
    tag = "Appointment",
    path = "/appointment/stats",
    operation_id = "appointment::stats",
    security(("jwt_token" = []))
)]
pub async fn stats(state: State<Arc<ApiState>>, claims: Claims) -> Result<Json<AppointmentStats>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    match queries::appointment::get_stats()
        .bind(&database)
        .one()
        .await
    {
        Ok(stats) => Ok(Json(stats)),
        Err(error) => {
            tracing::error!(?error, "Failed to get appointments stats");

            Err(Error::internal())
        }
    }
}
