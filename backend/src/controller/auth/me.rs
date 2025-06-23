use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use database::queries::{self, account::Account};

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::Claims,
};

#[utoipa::path(
    get,
    tag = "Auth",
    path = "/auth/me",
    operation_id = "auth::me",
    responses(
        (status = Status::OK, body = Account)
    ),
    security(("jwt_token" = []))
)]
pub async fn me(state: State<Arc<ApiState>>, claims: Claims) -> Result<Json<Account>> {
    let database = state.database().await?;

    let account = match queries::account::get()
        .bind(&database, &claims.sub)
        .opt()
        .await
    {
        Ok(Some(account)) => account,
        Ok(None) => {
            tracing::warn!(id =? claims.sub, "No account with given id");

            return Err(Error::builder()
                .status(StatusCode::UNAUTHORIZED)
                .message("Invalid token".into())
                .build());
        }
        Err(error) => {
            tracing::warn!(?error, "Failed to fetch account");

            return Err(Error::builder()
                .status(StatusCode::UNAUTHORIZED)
                .message("Invalid token".into())
                .build());
        }
    };

    Ok(Json(account))
}
