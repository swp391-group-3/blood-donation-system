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
    path = "/appointment/{id}/approve",
    operation_id = "appointment::approve",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    security(("jwt_token" = [])),
)]
pub async fn approve(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
) -> Result<()> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    if let Err(error) = queries::appointment::update_status()
        .bind(&database, &AppointmentStatus::Approved, &id)
        .await
    {
        tracing::error!(?error, id =? id, "Failed to approve appointment");

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

    let subject = "Appointment Approved".to_string();

    let body = format!(
        "<html>
        <body style=\"font-family: Arial, sans-serif; line-height: 1.6;\">
            <p>Dear <strong>{}</strong>,</p>

            <p>We're pleased to inform you that your blood donation appointment (ID: <strong>{}</strong>) has been <span style=\"color: green;\"><strong>approved</strong></span>.</p>

            <p>Please arrive at the donation center on your scheduled date and bring valid identification.</p>

            <p>Thank you for your commitment to saving lives!</p>

            <p>Sincerely,<br><strong>Blood Donation Team</strong></p>
        </body>
        </html>",
        account.name,
        id,
    );

    send(&account, subject, body, &state.mailer).await?;

    Ok(())
}
