mod create;
mod get_by_appointment_id;
mod get_by_member_id;
mod update;

use std::sync::Arc;

use axum::{Router, routing};
use chrono::{DateTime, Utc};
use ctypes::Role;
use database::queries::health::{GetByAppointmentIdBorrowed, GetByMemberIdBorrowed};
use model_mapper::Mapper;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{middleware, state::ApiState};

pub use create::*;
pub use get_by_appointment_id::*;
pub use get_by_member_id::*;
pub use update::*;

#[derive(Serialize, Deserialize, ToSchema, Mapper)]
#[mapper(derive(from(custom = "from_get_by_appointment_id"), ty = GetByAppointmentIdBorrowed::<'_>))]
#[mapper(derive(from(custom = "from_get_by_member_id"), ty = GetByMemberIdBorrowed::<'_>))]
pub struct Health {
    pub id: Uuid,
    pub appointment_id: Uuid,
    pub temperature: f32,
    pub weight: f32,
    pub upper_blood_pressure: i32,
    pub lower_blood_pressure: i32,
    pub heart_rate: i32,
    pub is_good_health: bool,
    pub note: String,
    pub created_at: DateTime<Utc>,
}

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    let staff_route = Router::new()
        .route("/appointment/{id}/health", routing::post(create))
        .route(
            "/appointment/{id}/health",
            routing::get(get_by_appointment_id),
        )
        .route("/health", routing::patch(update))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            middleware::authorize!(Role::Staff),
        ));
    let member_route = Router::new()
        .route("/health", routing::get(get_by_member_id))
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Member),
        ));

    Router::new().merge(staff_route).merge(member_route)
}
