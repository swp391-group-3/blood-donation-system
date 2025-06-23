mod approve;
mod create;
mod get;
mod get_by_member_id;
mod reject;
mod update_status;

use std::sync::Arc;

use axum::{Router, routing};
use ctypes::{AppointmentStatus, Role};
use database::{
    deadpool_postgres::Object,
    queries::{self, answer::GetByAppointmentIdBorrowed},
};
use model_mapper::Mapper;
use serde::Serialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, middleware, state::ApiState};

pub use approve::*;
pub use create::*;
pub use get::*;
pub use get_by_member_id::*;
pub use reject::*;
pub use update_status::*;

use super::{account::Account, blood_request::BloodRequest, donation::Donation, health::Health};

#[derive(Debug, Serialize, ToSchema, Mapper)]
#[mapper(from, ty = GetByAppointmentIdBorrowed::<'_>)]
pub struct Answer {
    pub question: String,
    pub answer: String,
}

#[derive(Serialize, ToSchema)]
pub struct Appointment {
    pub id: Uuid,
    pub member: Account,
    pub request: Option<BloodRequest>,
    pub answers: Vec<Answer>,
    pub health: Option<Health>,
    pub donation: Option<Donation>,
    pub status: AppointmentStatus,
}

impl Appointment {
    pub async fn new(
        id: Uuid,
        member_id: Uuid,
        request_id: Uuid,
        status: AppointmentStatus,
        database: &Object,
    ) -> Result<Self> {
        let member = queries::account::get()
            .bind(database, &member_id)
            .map(Account::from_get)
            .one()
            .await
            .unwrap();

        let request = queries::blood_request::get()
            .bind(database, &request_id)
            .map(BloodRequest::from_get)
            .opt()
            .await
            .unwrap();

        let answers = queries::answer::get_by_appointment_id()
            .bind(database, &id)
            .map(|raw| raw.into())
            .all()
            .await
            .unwrap();

        let health = queries::health::get_by_appointment_id()
            .bind(database, &id)
            .map(Health::from_get_by_appointment_id)
            .opt()
            .await
            .unwrap();

        let donation = queries::donation::get_by_appointment_id()
            .bind(database, &id)
            .map(Donation::from_get_by_appointment_id)
            .opt()
            .await
            .unwrap();

        Ok(Self {
            id,
            member,
            request,
            answers,
            health,
            donation,
            status,
        })
    }
}

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    let staff_router = Router::new()
        .route("/appointment/{id}", routing::get(get))
        .route("/appointment/{id}", routing::post(update_status))
        .route("/appointment/{id}/approve", routing::patch(approve))
        .route("/appointment/{id}/reject", routing::patch(reject))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            middleware::authorize!(Role::Staff),
        ));

    let member_route = Router::new()
        .route("/appointment", routing::get(get_by_member_id))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            middleware::authorize!(Role::Member),
        ));

    Router::new().merge(staff_router).merge(member_route).route(
        "/blood-request/{id}/create-appointment",
        routing::post(create),
    )
}
