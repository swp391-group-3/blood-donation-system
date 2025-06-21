use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::queries;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

use super::BloodRequest;

#[utoipa::path(
    get,
    tag = "Blood Request",
    path = "/blood-request/{id}",
    operation_id = "blood_request::get"
)]
pub async fn get(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<Json<BloodRequest>> {
    let database = state.database_pool.get().await?;

    let request = queries::blood_request::get()
        .bind(&database, &id)
        .map(BloodRequest::from_get)
        .one()
        .await?;

    Ok(Json(request))
}
