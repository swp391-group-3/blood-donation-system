use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries;

use crate::{error::Result, state::ApiState, util::jwt::Claims};

use super::Donation;

#[utoipa::path(
    get,
    tag = "Donation",
    path = "/donation/me",
    operation_id = "donation::get_by_member_id",
    responses(
        (status = Status::OK, body = Vec<Donation>)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_by_member_id(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<Donation>>> {
    let database = state.database_pool.get().await?;

    let donations = queries::donation::get_by_member_id()
        .bind(&database, &claims.sub)
        .map(Donation::from_get_by_member_id)
        .all()
        .await?;

    Ok(Json(donations))
}
