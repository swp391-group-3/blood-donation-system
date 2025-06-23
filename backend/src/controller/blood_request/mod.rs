mod create;
mod delete;
mod get;
mod get_all;
mod update;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use create::*;
pub use delete::*;
pub use get::*;
pub use get_all::*;
pub use update::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/blood-request", routing::post(create))
        .route("/blood-request/{id}", routing::put(update))
        .route("/blood-request/{id}", routing::delete(delete))
        .route("/blood-request/{id}", routing::get(get))
        .route("/blood-request", routing::get(get_all))
}
