use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use ctypes::Role;
use database::{
    client::Params,
    queries::{self},
};
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    post,
    tag = "Comment",
    path = "/blog/{id}/comment",
    request_body = String,
    responses(
        (status = Status::OK, body = Uuid)
    )
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(blog_id): Path<Uuid>,
    Json(content): Json<String>,
) -> Result<Json<Uuid>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Member], &database).await?;

    let params = queries::comment::CreateParams {
        account_id: claims.sub,
        blog_id,
        content,
    };

    match queries::comment::create()
        .params(&database, &params)
        .one()
        .await
    {
        Ok(id) => Ok(Json(id)),
        Err(error) => {
            tracing::error!(?error, "Failed to create comment");

            Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid comment content".into())
                .build())
        }
    }
}
