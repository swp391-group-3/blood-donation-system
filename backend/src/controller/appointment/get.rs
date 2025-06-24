use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use ctypes::Role;
use database::queries::{self, appointment::Appointment};
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    get,
    tag = "Appointment",
    path = "/appointment/{id}",
    operation_id = "appointment::get",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    responses(
        (status = Status::OK, body = Appointment)
    ),
    security(("jwt_token" = []))
)]
pub async fn get(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
) -> Result<Json<Appointment>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    match queries::appointment::get().bind(&database, &id).opt().await {
        Ok(Some(appointment)) => Ok(Json(appointment)),
        Ok(None) => Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("No appointment with given id".into())
            .build()),
        Err(error) => {
            tracing::error!(?error, "Failed to get appointment");

            Err(Error::internal())
        }
    }
}
