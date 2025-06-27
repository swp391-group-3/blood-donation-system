use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use database::queries;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::Claims,
};

#[utoipa::path(
    get,
    tag = "Account",
    path = "/account/is-donatable",
    operation_id = "account::is_donatable",
    security(("jwt_token" = [])),
)]
pub async fn is_donatable(state: State<Arc<ApiState>>, claims: Claims) -> Result<Json<bool>> {
    let database = state.database().await?;

    match queries::account::is_donatable()
        .bind(&database, &claims.sub)
        .one()
        .await
    {
        Ok(is_donatable) => Ok(Json(is_donatable)),
        Err(error) => {
            tracing::error!(?error, "Failed to check if account is donatable");

            Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("No account with given id".into())
                .build())
        }
    }
}
