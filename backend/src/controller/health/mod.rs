mod create;
mod get_by_appointment_id;
mod get_by_member_id;
mod update;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use create::*;
pub use get_by_appointment_id::*;
pub use get_by_member_id::*;
pub use update::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/appointment/{id}/health", routing::post(create))
        .route(
            "/appointment/{id}/health",
            routing::get(get_by_appointment_id),
        )
        .route("/health", routing::patch(update))
        .route("/health", routing::get(get_by_member_id))
}
