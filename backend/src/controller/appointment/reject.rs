use std::sync::Arc;

use crate::controller::account::Account;
use crate::controller::appointment::AppointmentDetail;
use crate::util::notification::send;
use crate::{error::Result, state::ApiState};
use axum::extract::{Path, State};
use ctypes::AppointmentStatus;
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
pub async fn reject(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<()> {
    let database = state.database_pool.get().await?;

    queries::appointment::update_status()
        .bind(&database, &AppointmentStatus::Rejected, &id)
        .await?;

    let appointment = queries::appointment::get()
        .bind(&database, &id)
        .map(AppointmentDetail::from)
        .one()
        .await?;

    let account = queries::account::get()
        .bind(&database, &appointment.member_id)
        .map(Account::from_get)
        .one()
        .await?;

    let subject = "Appointment Rejected".to_string();
    let body = format!("Your appointment with id {} has been rejected.", id);

    let _ = send(&account, subject, body).await?;

    Ok(())
}
