use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries;

use crate::{error::Result, state::ApiState, util::jwt::Claims};

use super::Health;

#[utoipa::path(
    get,
    tag = "Health",
    path = "/health",
    operation_id = "health::get_by_member_id",
    responses(
        (status = Status::OK, body = Vec<Health>)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_by_member_id(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<Health>>> {
    let database = state.database_pool.get().await?;

    let healths = queries::health::get_by_member_id()
        .bind(&database, &claims.sub)
        .map(Health::from_get_by_member_id)
        .all()
        .await?;

    Ok(Json(healths))
}
