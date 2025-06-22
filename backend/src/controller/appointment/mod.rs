mod create;
mod get;
mod get_answer;
mod get_by_member_id;
mod update_status;

use std::sync::Arc;

use axum::{Router, routing};
use chrono::{DateTime, Utc};
use ctypes::{AppointmentStatus, Role};
use database::queries::appointment::{GetBorrowed, GetByMemberIdBorrowed};
use model_mapper::Mapper;
use serde::Serialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{middleware, state::ApiState};

pub use create::*;
pub use get::*;
pub use get_answer::*;
pub use get_by_member_id::*;
pub use update_status::*;

#[derive(Serialize, ToSchema, Mapper)]
#[mapper(derive(from, ty = GetByMemberIdBorrowed::<'_>))]
#[mapper(derive(from, ty = GetBorrowed::<'_>))]
pub struct Appointment {
    pub id: Uuid,
    pub request_id: Uuid,
    pub member_id: Uuid,
    pub title: String,
    pub status: AppointmentStatus,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
}

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    let staff_router = Router::new()
        .route("/appointment/{id}/answer", routing::get(get_answer))
        .route("/appointment/{id}", routing::get(get))
        .route("/appointment/{id}", routing::post(update_status))
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
