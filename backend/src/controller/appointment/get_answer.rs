use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use ctypes::Role;
use database::queries::{self, answer::Answer};
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    get,
    tag = "Appointment",
    path = "/appointment/{id}/answer",
    operation_id = "appointment::get_answer",
    responses(
        (status = Status::OK, body = Answer)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_answer(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
) -> Result<Json<Vec<Answer>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    match queries::answer::get_by_appointment_id()
        .bind(&database, &id)
        .all()
        .await
    {
        Ok(answers) => Ok(Json(answers)),
        Err(error) => {
            tracing::error!(?error, "Failed to get appointment answers");

            Err(Error::internal())
        }
    }
}
