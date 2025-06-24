use std::sync::Arc;

use crate::error::Error;
use crate::util::auth::{Claims, authorize};
use crate::util::notification::send;
use crate::{error::Result, state::ApiState};
use axum::extract::{Path, State};
use axum::http::StatusCode;
use ctypes::{AppointmentStatus, Role};
use database::queries::{self};
use uuid::Uuid;

#[utoipa::path(
    patch,
    tag = "Appointment",
    path = "/appointment/{id}/reject",
    operation_id = "appointment::reject",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    security(("jwt_token" = [])),
)]
pub async fn reject(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
) -> Result<()> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    if let Err(error) = queries::appointment::update_status()
        .bind(&database, &AppointmentStatus::Rejected, &id)
        .await
    {
        tracing::error!(?error, id =? id, "Failed to reject appointment");

        return Err(Error::internal());
    }

    let appointment = match queries::appointment::get().bind(&database, &id).one().await {
        Ok(appointment) => appointment,
        Err(error) => {
            tracing::error!(?error, id =? id, "Failed to get appointment");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid appointment id".into())
                .build());
        }
    };

    let account = match queries::account::get()
        .bind(&database, &appointment.member_id)
        .one()
        .await
    {
        Ok(account) => account,
        Err(error) => {
            tracing::error!(?error, "No account match appointment");
            return Err(Error::internal());
        }
    };

    let subject = "Appointment Rejected".to_string();
    let body = format!("Your appointment with id {} has been rejected.", id);

    send(&account, subject, body, &state.mailer).await?;

    Ok(())
}
