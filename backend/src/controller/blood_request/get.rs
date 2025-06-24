use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use database::queries::{self, blood_request::BloodRequest};
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Blood Request",
    path = "/blood-request/{id}",
    operation_id = "blood_request::get"
)]
pub async fn get(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<Json<BloodRequest>> {
    let database = state.database().await?;

    match queries::blood_request::get()
        .bind(&database, &id)
        .opt()
        .await
    {
        Ok(Some(request)) => Ok(Json(request)),
        Ok(None) => Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("No blood request with given id".into())
            .build()),
        Err(error) => {
            tracing::error!(?error, "Failed to get blood request");

            Err(Error::internal())
        }
    }
}
