use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries;

use crate::{error::Result, state::ApiState};

use super::Account;

#[utoipa::path(
    get,
    tag = "Account",
    path = "/account",
    operation_id = "account::get_all",
    security(("jwt_token" = []))
)]
pub async fn get_all(state: State<Arc<ApiState>>) -> Result<Json<Vec<Account>>> {
    let database = state.database_pool.get().await?;

    let accounts = queries::account::get_all()
        .bind(&database)
        .map(Account::from_get_all)
        .all()
        .await?;

    Ok(Json(accounts))
}
