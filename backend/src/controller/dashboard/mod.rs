mod stats;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use stats::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new().route("/dashboard/stats", routing::get(stats))
}
