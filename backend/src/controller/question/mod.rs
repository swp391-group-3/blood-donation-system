mod create;
mod delete;
mod get_all;
mod update;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use create::*;
pub use delete::*;
pub use get_all::*;
pub use update::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/question", routing::post(create))
        .route("/question/{id}", routing::put(update))
        .route("/question/{id}", routing::delete(delete))
        .route("/question", routing::get(get_all))
}
