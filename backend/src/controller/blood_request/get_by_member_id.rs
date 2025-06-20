use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries;

use crate::{error::Result, state::ApiState, util::jwt::Claims};

use super::BloodRequest;

#[utoipa::path(
    get,
    tag = "Blood Request",
    path = "/blood-request/me",
    operation_id = "blood_request::get_by_member_id",
    security(("jwt_token" = []))
)]
pub async fn get_by_member_id(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<BloodRequest>>> {
    let database = state.database_pool.get().await?;

    let requests = queries::blood_request::get_by_member_id()
        .bind(&database, &claims.sub)
        .map(BloodRequest::from_get_by_member_id)
        .all()
        .await?;

    Ok(Json(requests))
}
