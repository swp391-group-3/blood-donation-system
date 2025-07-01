mod get_all;
mod prompt;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use get_all::*;
pub use prompt::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/chat", routing::post(prompt))
        .route("/chat", routing::get(get_all))
}
