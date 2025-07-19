use std::sync::Arc;

use axum::{Json, extract::State};
use ctypes::Role;
use database::queries::{self, dashboard::DashboardStats};

use crate::{
    state::ApiState,
    util::auth::{Claims, authorize},
};

use crate::error::{Error, Result};

#[utoipa::path(
    get,
    tag = "Dashboard",
    path = "/dashboard/stats",
    operation_id = "dashboard::stats",
    security(("jwt_token" = []))
)]
pub async fn stats(state: State<Arc<ApiState>>, claims: Claims) -> Result<Json<DashboardStats>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Admin], &database).await?;

    match queries::dashboard::get_stats().bind(&database).one().await {
        Ok(stats) => Ok(Json(stats)),
        Err(error) => {
            tracing::error!(?error, "Failed to get dashboard stats");

            Err(Error::internal())
        }
    }
}
