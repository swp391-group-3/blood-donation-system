use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use ctypes::Role;
use database::queries::{self, blood_bag::BloodStorageStats};

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    get,
    tag = "Blood Bag",
    path = "/blood-bag/stats",
    operation_id = "blood-bag::stats",
    security(("jwt_token" = []))
)]
pub async fn stats(state: State<Arc<ApiState>>, claims: Claims) -> Result<Json<BloodStorageStats>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    match queries::blood_bag::get_stats().bind(&database).one().await {
        Ok(stats) => Ok(Json(stats)),
        Err(error) => {
            tracing::error!(?error, "Failed to get blood storage stats");

            Err(Error::internal())
        }
    }
}
