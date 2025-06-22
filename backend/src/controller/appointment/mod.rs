mod approve;
mod create;
mod get;
mod get_answer;
mod get_by_member_id;
mod reject;
mod update_status;

use std::sync::Arc;

use axum::{Router, routing};
use ctypes::Role;

use crate::{middleware, state::ApiState};

pub use approve::*;
pub use create::*;
pub use get::*;
pub use get_answer::*;
pub use get_by_member_id::*;
pub use reject::*;
pub use update_status::*;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    let staff_router = Router::new()
        .route("/appointment/{id}/answer", routing::get(get_answer))
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
