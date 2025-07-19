mod donation_trend;
mod request_trend;
mod stats;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use donation_trend::*;
pub use request_trend::*;
pub use stats::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/dashboard/stats", routing::get(stats))
        .route("/dashboard/trend/donation", routing::get(donation_trend))
        .route("/dashboard/trend/request", routing::get(request_trend))
}
