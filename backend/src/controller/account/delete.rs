use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
};
use ctypes::Role;
use database::queries;
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    delete,
    tag = "Account",
    path = "/account/{id}",
    operation_id = "account::delete",
    params(
        ("id" = Uuid, Path, description = "The UUID of the account")
    ),
    security(("jwt_token" = []))
)]
pub async fn delete(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
) -> Result<()> {
    let database = state.database().await?;

    authorize(&claims, [Role::Admin], &database).await?;

    if let Err(error) = queries::account::delete().bind(&database, &id).await {
        tracing::error!(?error, id =? id, "Failed to delete account with given id");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Account with given id does not existed".into())
            .build());
    }

    Ok(())
}
