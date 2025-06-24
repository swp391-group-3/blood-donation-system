use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use database::queries::{self, blood_bag::BloodBag};
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Blood Bag",
    path = "/blood-bag/{id}",
    operation_id = "blood-bag::get",
    params(
        ("id" = Uuid, Path, description = "The UUID of the blood bag")
    ),
    responses(
        (status = Status::OK, body = BloodBag)
    ),
    security(("jwt_token" = []))
)]
pub async fn get(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<Json<BloodBag>> {
    let database = state.database().await?;

    match queries::blood_bag::get().bind(&database, &id).opt().await {
        Ok(Some(bloog_bag)) => Ok(Json(bloog_bag)),
        Ok(None) => Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("No bloog bag with given id".into())
            .build()),
        Err(error) => {
            tracing::error!(?error, "Failed to get blood bag");

            Err(Error::internal())
        }
    }
}
