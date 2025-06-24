use std::sync::Arc;

use axum::{Json, extract::State};
use ctypes::Role;
use database::queries::{self, account::Account};

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    get,
    tag = "Account",
    path = "/account",
    operation_id = "account::get_all",
    security(("jwt_token" = []))
)]
pub async fn get_all(state: State<Arc<ApiState>>, claims: Claims) -> Result<Json<Vec<Account>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Admin], &database).await?;

    match queries::account::get_all().bind(&database).all().await {
        Ok(accounts) => Ok(Json(accounts)),
        Err(error) => {
            tracing::error!(?error, "Failed to get account list");

            Err(Error::internal())
        }
    }
}
