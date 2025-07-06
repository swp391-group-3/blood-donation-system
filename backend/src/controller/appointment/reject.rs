use std::sync::Arc;

use crate::error::Error;
use crate::util::auth::{Claims, authorize};
use crate::util::notification::send;
use crate::{error::Result, state::ApiState};
use axum::Json;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use ctypes::{AppointmentStatus, Role};
use database::queries::{self};
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Deserialize, ToSchema)]
#[schema(as = appointment::reject::Request)]
pub struct Request {
    pub reason: Option<String>,
}

#[utoipa::path(
    patch,
    tag = "Appointment",
    path = "/appointment/{id}/reject",
    operation_id = "appointment::reject",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    request_body = Request,
    security(("jwt_token" = [])),
)]
pub async fn reject(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
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

    let reason_html = if let Some(reason) = request.reason.as_deref() {
        if let Err(error) = queries::appointment::update_reason()
            .bind(&database, &reason, &id)
            .await
        {
            tracing::error!(?error, id =? id, "Failed to set rejected reason");

            return Err(Error::internal());
        }

        format!("<p>Reason for rejection: {}</p>", reason)
    } else {
        "".to_string()
    };

    let body = format!(
        "<html>
        <body style=\"font-family: Arial, sans-serif; line-height: 1.6;\">
            <p>Dear <strong>{}</strong>,</p>

            <p>We regret to inform you that your blood donation appointment (ID: <strong>{}</strong>) has been <span style=\"color: red;\"><strong>rejected</strong></span>.</p>
            
            {}
            
            <p>If you believe this is a mistake or would like to schedule another appointment, please contact our staff or try again via the system.</p>

            <p>We appreciate your willingness to donate and hope to see you again soon.</p>

            <p>Sincerely,<br><strong>Blood Donation Team</strong></p>
        </body>
        </html>",
        account.name,
        id,
        reason_html,
    );

    send(&account, subject, body, &state.mailer).await?;

    Ok(())
}
