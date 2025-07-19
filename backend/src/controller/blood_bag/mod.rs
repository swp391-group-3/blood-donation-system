mod create;
mod delete;
mod get;
mod get_all;
mod stats;
mod update;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use create::*;
pub use delete::*;
pub use get::*;
pub use get_all::*;
pub use stats::*;
pub use update::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/blood-bag", routing::get(get_all))
        .route("/blood-bag/{id}", routing::get(get))
        .route("/donation/{id}/blood-bag", routing::post(create))
        .route("/blood-bag/{id}", routing::delete(delete))
        .route("/blood-bag/{id}", routing::patch(update))
        .route("/blood-bag/stats", routing::get(stats))
}
