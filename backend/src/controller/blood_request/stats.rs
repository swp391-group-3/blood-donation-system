use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries::{self, blood_request::BloodRequestsStats};

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::Claims,
};

#[utoipa::path(
    get,
    tag = "Blood Request",
    path = "/blood-request/stats",
    operation_id = "blood_request::stats",
    security(("jwt_token" = []))
)]
pub async fn stats(
    state: State<Arc<ApiState>>,
    claims: Option<Claims>,
) -> Result<Json<BloodRequestsStats>> {
    let database = state.database().await?;

    let account_id = claims.map(|c| c.sub).unwrap_or_else(uuid::Uuid::nil);

    match queries::blood_request::get_stats()
        .bind(&database, &account_id)
        .one()
        .await
    {
        Ok(stats) => Ok(Json(stats)),
        Err(error) => {
            tracing::error!(?error, "Failed to get blood requests stats");

            Err(Error::internal())
        }
    }
}
