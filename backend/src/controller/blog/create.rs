use std::sync::Arc;

use axum::{Json, extract::State, http::StatusCode};
use database::{
    client::Params,
    queries::{self, blog::CreateParams},
};
use model_mapper::Mapper;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::Claims,
};

#[derive(Deserialize, Serialize, ToSchema, Mapper)]
#[schema(as = blog::create::Request)]
#[mapper(
    into(custom = "with_account_id"),
    ty = CreateParams::<String, String, String>,
    add(field = account_id, ty = Uuid),
)]
pub struct Request {
    pub title: String,
    pub description: String,
    pub content: String,
}

#[utoipa::path(
    post,
    tag = "Blog",
    path = "/blog",
    request_body = Request,
    responses(
        (status = 201, description = "Create blog successfully", body = Uuid)
    )
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let database = state.database().await?;

    match queries::blog::create()
        .params(&database, &request.with_account_id(claims.sub))
        .one()
        .await
    {
        Ok(id) => Ok(Json(id)),
        Err(error) => {
            tracing::error!(?error, "Failed to create blog");

            Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid blog data".into())
                .build())
        }
    }
}
