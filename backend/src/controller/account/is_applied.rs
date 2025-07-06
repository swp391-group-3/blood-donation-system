use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::Claims,
};

#[utoipa::path(
    get,
    tag = "Account",
    path = "/account/is-applied",
    operation_id = "account::is_applied",
    security(("jwt_token" = [])),
)]
pub async fn is_applied(state: State<Arc<ApiState>>, claims: Claims) -> Result<Json<bool>> {
    let database = state.database().await?;

    match queries::account::is_applied()
        .bind(&database, &claims.sub)
        .one()
        .await
    {
        Ok(is_applied) => Ok(Json(is_applied)),
        Err(error) => {
            tracing::error!(
                ?error,
                "Failed to check if account is applied for an appointment"
            );

            Err(Error::internal())
        }
    }
}
