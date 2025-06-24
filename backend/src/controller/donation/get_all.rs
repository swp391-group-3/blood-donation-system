use std::sync::Arc;

use axum::{Json, extract::State};
use ctypes::Role;
use database::queries::{self, donation::Donation};

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    get,
    tag = "Donation",
    path = "/donation",
    operation_id = "donation::get_all",
    responses(
        (status = Status::OK, body = Vec<Donation>)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_all(state: State<Arc<ApiState>>, claims: Claims) -> Result<Json<Vec<Donation>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Admin], &database).await?;

    match queries::donation::get_all().bind(&database).all().await {
        Ok(donations) => Ok(Json(donations)),
        Err(error) => {
            tracing::error!(?error, "Failed to get donation list");

            Err(Error::internal())
        }
    }
}
