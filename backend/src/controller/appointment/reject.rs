use std::sync::Arc;

use crate::error::Error;
use crate::util::auth::{Claims, authorize};
use crate::util::notification::send;
use crate::util::validation::ValidJson;
use crate::{error::Result, state::ApiState};
use axum::extract::{Path, State};
use axum::http::StatusCode;
use ctypes::Role;
use database::queries::{self};
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

#[derive(Deserialize, ToSchema, Validate)]
#[schema(as = appointment::reject::Request)]
pub struct Request {
    #[validate(length(min = 1))]
    pub reason: String,
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
    ValidJson(request): ValidJson<Request>,
) -> Result<()> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    if let Err(error) = queries::appointment::reject()
        .bind(&database, &request.reason, &id)
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
        .bind(&database, &appointment.donor_id)
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
    let body = format!(
        "<html>
        <body style=\"font-family: Arial, sans-serif; line-height: 1.6;\">
            <p>Dear <strong>{}</strong>,</p>

            <p>We regret to inform you that your blood donation appointment (ID: <strong>{}</strong>) has been <span style=\"color: red;\"><strong>rejected</strong></span>.</p>
            
            <p>Reason for rejection: {}</p>
            
            <p>If you believe this is a mistake or would like to schedule another appointment, please contact our staff or try again via the system.</p>

            <p>We appreciate your willingness to donate and hope to see you again soon.</p>

            <p>Sincerely,<br><strong>Blood Donation Team</strong></p>
        </body>
        </html>",
        account.name,
        id,
        request.reason,
    );

    send(&account, subject, body, &state.mailer).await?;

    Ok(())
}
