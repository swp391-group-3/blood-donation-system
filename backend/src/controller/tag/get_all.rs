use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries::{self, tag::Tag};

use crate::{
    error::{Error, Result},
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Tag",
    path = "/tag",
    operation_id = "tag::get_all",
    responses(
        (status = Status::OK, body = Vec<Tag>)
    )
)]
pub async fn get_all(state: State<Arc<ApiState>>) -> Result<Json<Vec<Tag>>> {
    let database = state.database().await?;

    match queries::tag::get_all().bind(&database).all().await {
        Ok(tags) => Ok(Json(tags)),
        Err(error) => {
            tracing::error!(?error, "Failed to get tag list");

            Err(Error::internal())
        }
    }
}
