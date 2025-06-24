use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use ctypes::Role;
use database::queries;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    post,
    tag = "Question",
    path = "/question",
    operation_id = "question::create",
    request_body = String,
    responses(
        (status = Status::OK, body = i32)
    ),
    security(("jwt_token" = []))
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    claims: Claims,
    content: String,
) -> Result<Json<i32>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    match queries::question::create()
        .bind(&database, &content)
        .one()
        .await
    {
        Ok(id) => Ok(Json(id)),
        Err(error) => {
            tracing::error!(?error, "Failed to create question");

            Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid question content".into())
                .build())
        }
    }
}
