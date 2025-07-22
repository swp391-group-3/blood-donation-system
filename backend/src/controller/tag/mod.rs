mod get_all;

use axum::{Router, routing};
use std::sync::Arc;

pub use get_all::*;

use crate::state::ApiState;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new().route("/tag", routing::get(get_all))
}
