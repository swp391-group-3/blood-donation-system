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
use validator::Validate;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::{auth::Claims, validation::ValidJson},
};

#[derive(Deserialize, Serialize, ToSchema, Mapper, Validate)]
#[schema(as = blog::create::Request)]
#[mapper(
    into(custom = "with_account_id"),
    ty = CreateParams::<String, String, String, String, Vec<String>>,
    add(field = account_id, ty = Uuid),
)]
pub struct Request {
    #[validate(length(min = 1))]
    pub title: String,
    #[validate(length(min = 1))]
    pub description: String,
    #[validate(length(min = 1))]
    pub content: String,
    #[validate(length(min = 1))]
    pub tags: Vec<String>,
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
    ValidJson(request): ValidJson<Request>,
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
