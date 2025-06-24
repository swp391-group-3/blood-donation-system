use axum::{
    Json,
    extract::{Query, State},
};
use database::queries::{self, blog::Blog};
use serde::Deserialize;
use std::sync::Arc;
use utoipa::ToSchema;

use crate::{
    error::{Error, Result},
    state::ApiState,
};

#[derive(Deserialize, ToSchema)]
#[schema(as = blod::create::Request)]
pub struct Request {
    pub query: Option<String>,
}

#[utoipa::path(
    get,
    tag = "Blog",
    path = "/blog",
    responses(
        (status = 200, description = "Get Blog Successfully", body = Blog)
    )
)]
pub async fn get_all(
    state: State<Arc<ApiState>>,
    Query(request): Query<Request>,
) -> Result<Json<Vec<Blog>>> {
    let database = state.database().await?;

    match queries::blog::get_all()
        .bind(&database, &request.query)
        .all()
        .await
    {
        Ok(blogs) => Ok(Json(blogs)),
        Err(error) => {
            tracing::error!(?error, "Failed to get blog list");

            Err(Error::internal())
        }
    }
}
