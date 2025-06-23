use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use ctypes::Role;
use database::queries::{self, account::Account};
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    get,
    tag = "Account",
    path = "/account/{id}",
    operation_id = "account::get",
    params(
        ("id" = Uuid, Path, description = "The UUID of the account")
    ),
    responses(
        (status = Status::OK, body = Account)
    ),
    security(("jwt_token" = []))
)]
pub async fn get(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
) -> Result<Json<Option<Account>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Admin], &database).await?;

    match queries::account::get().bind(&database, &id).opt().await {
        Ok(account) => Ok(Json(account)),
        Err(error) => {
            tracing::error!(?error, id = ?id, "Failed to get account with given id");

            Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("No account with given id".into())
                .build())
        }
    }
}
