use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use std::sync::Arc;
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
};
use database::queries;

#[utoipa::path(
    put,
    tag = "Comment",
    path = "/comment/{id}",
    params(
        ("id" = Uuid, Path, description = "Comment Id")
    ),
    responses(
        (status = Status::OK)
    )
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
    Json(content): Json<String>,
) -> Result<()> {
    let database = state.database().await?;

    if let Err(error) = queries::comment::update()
        .bind(&database, &Some(content), &id)
        .await
    {
        tracing::error!(?error, "Failed to update question");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Invalid new comment".into())
            .build());
    }

    Ok(())
}
