use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
};
use ctypes::Role;
use database::queries;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    delete,
    tag = "Question",
    path = "/question/{id}",
    operation_id = "question::delete",
    params(
        ("id" = i32, Path, description = "Question id")
    ),
    security(("jwt_token" = []))
)]
pub async fn delete(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<i32>,
) -> Result<()> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    if let Err(error) = queries::question::delete().bind(&database, &id).await {
        tracing::error!(?error, "Failed to delete question");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Invalid question id".into())
            .build());
    }

    Ok(())
}
