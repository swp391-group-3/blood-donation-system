mod approve;
mod create;
mod done;
mod get;
mod get_all;
mod get_answer;
mod get_by_member_id;
mod reject;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use approve::*;
pub use create::*;
pub use done::*;
pub use get::*;
pub use get_all::*;
pub use get_answer::*;
pub use get_by_member_id::*;
pub use reject::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/appointment/{id}", routing::get(get))
        .route("/appointment/{id}/answer", routing::get(get_answer))
        .route("/appointment/{id}/approve", routing::patch(approve))
        .route("/appointment/{id}/reject", routing::patch(reject))
        .route("/appointment/{id}/done", routing::patch(done))
        .route("/appointment", routing::get(get_all))
        .route("/appointment/me", routing::get(get_by_member_id))
        .route(
            "/blood-request/{id}/create-appointment",
            routing::post(create),
        )
}
