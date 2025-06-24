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
    put,
    tag = "Question",
    path = "/question/{id}",
    operation_id = "question::update",
    params(
        ("id" = i32, Path, description = "Question id")
    ),
    request_body = String,
    security(("jwt_token" = []))
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<i32>,
    new_content: String,
) -> Result<()> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    if let Err(error) = queries::question::update()
        .bind(&database, &new_content, &id)
        .await
    {
        tracing::error!(?error, "Failed to update question");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Failed to update question".into())
            .build());
    }

    Ok(())
}
