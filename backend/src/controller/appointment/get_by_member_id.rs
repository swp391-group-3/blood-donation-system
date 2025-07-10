use std::sync::Arc;

use axum::{Json, extract::State};
use ctypes::Role;
use database::queries::{self, appointment::Appointment};

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    get,
    tag = "Appointment",
    path = "/appointment/me",
    operation_id = "appointment::get_by_member_id",
    responses(
        (status = Status::OK, body = Appointment)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_by_member_id(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<Appointment>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Member], &database).await?;

    let appointments = match queries::appointment::get_by_member_id()
        .bind(&database, &claims.sub)
        .all()
        .await
    {
        Ok(appointments) => appointments,
        Err(error) => {
            tracing::error!(?error, "Failed to get appointment list");

            return Err(Error::internal());
        }
    };

    Ok(Json(appointments))
}
