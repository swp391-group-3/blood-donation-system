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
    path = "/appointment/{id}/approve",
    operation_id = "appointment::approve",
    params(
        ("id" = Uuid, Path, description = "Appointment id")
    ),
    security(("jwt_token" = [])),
)]
pub async fn approve(state: State<Arc<ApiState>>, Path(id): Path<Uuid>) -> Result<()> {
    let database = state.database_pool.get().await.unwrap();

    queries::appointment::update_status()
        .bind(&database, &AppointmentStatus::Approved, &id)
        .await
        .unwrap();

    let appointment = queries::appointment::get()
        .bind(&database, &id)
        .map(AppointmentDetail::from)
        .one()
        .await
        .unwrap();

    let account = queries::account::get()
        .bind(&database, &appointment.member_id)
        .map(Account::from_get)
        .one()
        .await
        .unwrap();

    let subject = "Appointment Approved".to_string();
    let body = format!("Your appointment with id {} has been approved.", id);

    send(&account, subject, body).await?;

    Ok(())
}
