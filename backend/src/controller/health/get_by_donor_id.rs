use std::sync::Arc;

use axum::{Json, extract::State};
use ctypes::Role;
use database::queries::{self, health::Health};

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    get,
    tag = "Health",
    path = "/health",
    operation_id = "health::get_by_donor_id",
    responses(
        (status = Status::OK, body = Vec<Health>)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_by_donor_id(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<Health>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Donor], &database).await?;

    match queries::health::get_by_donor_id()
        .bind(&database, &claims.sub)
        .all()
        .await
    {
        Ok(healths) => Ok(Json(healths)),
        Err(error) => {
            tracing::error!(?error, "Failed to get health list");

            Err(Error::internal())
        }
    }
}
