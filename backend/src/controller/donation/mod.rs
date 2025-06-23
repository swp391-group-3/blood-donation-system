mod create;
mod get;
mod get_all;
mod get_by_appointment_id;
mod get_by_member_id;
mod update;

use std::sync::Arc;

use axum::{Router, routing};
use chrono::{DateTime, Utc};
use ctypes::{DonationType, Role};
use database::queries::donation::{Get, GetAll, GetByAppointmentId, GetByMemberId};
use model_mapper::Mapper;
use serde::Serialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{middleware, state::ApiState};

pub use create::*;
pub use get::*;
pub use get_all::*;
pub use get_by_appointment_id::*;
pub use get_by_member_id::*;
pub use update::*;

#[derive(Serialize, ToSchema, Mapper)]
#[mapper(derive(from(custom = "from_get"), ty = Get))]
#[mapper(derive(from(custom = "from_get_all"), ty = GetAll))]
#[mapper(derive(from(custom = "from_get_by_member_id"), ty = GetByMemberId))]
#[mapper(derive(from(custom = "from_get_by_appointment_id"), ty = GetByAppointmentId))]
pub struct Donation {
    pub id: Uuid,
    pub appointment_id: Uuid,
    pub r#type: DonationType,
    pub amount: i32,
    pub created_at: DateTime<Utc>,
}

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    let staff_route = Router::new()
        .route("/appointment/{id}/donation", routing::post(create))
        .route(
            "/appointment/{id}/donation",
            routing::get(get_by_appointment_id),
        )
        .route("/donation/{id}", routing::get(get))
        .route("/donation", routing::get(get_all))
        .route("/donation/{id}", routing::patch(update))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            middleware::authorize!(Role::Staff),
        ));
    let member_route = Router::new()
        .route("/donation/me", routing::get(get_by_member_id))
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Member),
        ));

    Router::new().merge(staff_route).merge(member_route)
}
