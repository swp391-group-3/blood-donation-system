mod create;
mod delete;
mod get;
mod get_all;
mod update;

use axum::{Router, routing};
use std::sync::Arc;

pub use create::*;
pub use delete::*;
pub use get::*;
pub use get_all::*;
pub use update::*;

use crate::state::ApiState;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/blog", routing::post(create))
        .route("/blog", routing::get(get_all))
        .route("/blog/{id}", routing::get(get))
        .route("/blog/{id}", routing::patch(update))
        .route("/blog/{id}", routing::delete(delete))
}
