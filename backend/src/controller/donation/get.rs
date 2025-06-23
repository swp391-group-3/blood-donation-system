use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use ctypes::Role;
use database::queries::{self, donation::Donation};
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    get,
    tag = "Donation",
    path = "/donation/{id}",
    operation_id = "donation::get",
    params(
        ("id" = Uuid, Path, description = "Donation id")
    ),
    responses(
        (status = Status::OK, body = Donation)
    ),
    security(("jwt_token" = []))
)]
pub async fn get(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
) -> Result<Json<Donation>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    match queries::donation::get().bind(&database, &id).opt().await {
        Ok(Some(donation)) => Ok(Json(donation)),
        Ok(None) => Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("No donation with given id".into())
            .build()),
        Err(error) => {
            tracing::error!(?error, "Failed to get donation");

            Err(Error::internal())
        }
    }
}
