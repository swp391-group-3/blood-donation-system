mod approve;
mod create;
mod get;
mod get_by_member_id;
mod reject;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use approve::*;
pub use create::*;
pub use get::*;
pub use get_by_member_id::*;
pub use reject::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/appointment/{id}", routing::get(get))
        .route("/appointment/{id}/approve", routing::patch(approve))
        .route("/appointment/{id}/reject", routing::patch(reject))
        .route("/appointment", routing::get(get_by_member_id))
        .route(
            "/blood-request/{id}/create-appointment",
            routing::post(create),
        )
}
