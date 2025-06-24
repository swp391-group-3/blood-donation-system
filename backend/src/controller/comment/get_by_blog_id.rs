use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use database::queries::{self, comment::Comment};
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
};

#[utoipa::path(
    get,
    tags = ["Blog", "Comment"],
    path = "/blog/{id}/comment",
    responses(
        (status = Status::OK, body = Vec<Comment>)
    )
)]
pub async fn get_by_blog_id(
    state: State<Arc<ApiState>>,
    Path(blog_id): Path<Uuid>,
) -> Result<Json<Vec<Comment>>> {
    let database = state.database().await?;

    match queries::comment::get_by_blog_id()
        .bind(&database, &blog_id)
        .all()
        .await
    {
        Ok(comments) => Ok(Json(comments)),
        Err(error) => {
            tracing::error!(?error, "Failed to get comment");

            Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid blog id".into())
                .build())
        }
    }
}
