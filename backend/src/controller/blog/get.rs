use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use database::queries::{self, blog::Blog};
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Blog",
    path = "/blog/{id}",
    params(
        ("id" = Uuid, description = "Blog Id")
    ),
    responses(
        (status = Status::OK, body = Blog)
    )
)]
pub async fn get(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<Json<Blog>> {
    let database = state.database().await?;

    match queries::blog::get().bind(&database, &id).opt().await {
        Ok(Some(blog)) => Ok(Json(blog)),
        Ok(None) => Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("No blog with given id".into())
            .build()),
        Err(error) => {
            tracing::error!(?error, "Failed to get blog");

            Err(Error::internal())
        }
    }
}
