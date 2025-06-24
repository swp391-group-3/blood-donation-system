use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
};
use database::queries::{self};
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::Claims,
};

#[utoipa::path(
    delete,
    tag = "Blog",
    path = "/blog/{id}",
    operation_id = "blog::delete",
    params(
        ("id" = Uuid, Path, description = "Blog id")
    ),
)]
pub async fn delete(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
) -> Result<()> {
    let database = state.database().await?;

    // TODO: member can only delete their blog

    if let Err(error) = queries::blog::delete()
        .bind(&database, &id, &claims.sub)
        .await
    {
        tracing::error!(?error, "Failed to delete blog");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Invalid blog id".into())
            .build());
    }

    Ok(())
}
