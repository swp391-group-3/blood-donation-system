use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use database::{
    client::Params,
    queries::{self, blog::UpdateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::Claims,
};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = blog::update::Request)]
#[mapper(
    into(custom = "with_account_context"),
    ty = UpdateParams::<String, String, String>,
    add(field = id, ty = Uuid),
    add(field = account_id, ty = Uuid)
)]
pub struct Request {
    pub title: Option<String>,
    pub description: Option<String>,
    pub content: Option<String>,
}

#[utoipa::path(
    patch,
    tag = "Blog",
    path = "/blog/{id}",
    operation_id = "blog::update",
    params(
        ("id" = Uuid, Path, description = "Blog id")
    ),
    request_body = Request,
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<()> {
    let database = state.database().await?;

    if let Err(error) = queries::blog::update()
        .params(&database, &request.with_account_context(id, claims.sub))
        .await
    {
        tracing::error!(?error, "Failed to update blog");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Invalid update blog data".into())
            .build());
    }

    Ok(())
}
