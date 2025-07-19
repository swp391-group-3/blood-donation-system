mod blood_group_distribution;
mod donation_trends;
mod request_trends;
mod stats;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use blood_group_distribution::*;
pub use donation_trends::*;
pub use request_trends::*;
pub use stats::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/dashboard/stats", routing::get(stats))
        .route("/dashboard/donation-trends", routing::get(donation_trends))
        .route("/dashboard/request-trends", routing::get(request_trends))
        .route(
            "/dashboard/blood-group-distribution",
            routing::get(blood_group_distribution),
        )
}
