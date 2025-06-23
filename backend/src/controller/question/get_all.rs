use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries::{self, question::Question};

use crate::{
    error::{Error, Result},
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Question",
    path = "/question",
    operation_id = "question::get_all",
    responses(
        (status = Status::OK, body = Question)
    )
)]
pub async fn get_all(state: State<Arc<ApiState>>) -> Result<Json<Vec<Question>>> {
    let database = state.database().await?;

    match queries::question::get_all().bind(&database).all().await {
        Ok(questions) => Ok(Json(questions)),
        Err(error) => {
            tracing::error!(?error, "Failed to get question list");

            Err(Error::internal())
        }
    }
}
