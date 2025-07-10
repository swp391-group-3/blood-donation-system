use axum::extract::{Path, State};
use std::sync::Arc;
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
};
use database::queries::{self};

#[utoipa::path(
    delete,
    tag = "Comment",
    path = "/comment/{id}",
    params(
        ("id" = Uuid, Path, description = "Content Id")
    ),
    responses(
        (status = Status::OK)
    ),
    security(("jwt_token" = []))
)]
pub async fn delete(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<()> {
    let database = state.database().await?;

    // TODO: donor can only delete their comment

    if let Err(error) = queries::comment::delete().bind(&database, &id).await {
        tracing::error!(?error, "Failed to delete question");

        return Err(Error::internal());
    }

    Ok(())
}
