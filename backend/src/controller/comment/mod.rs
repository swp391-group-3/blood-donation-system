mod create;
mod delete;
mod get_by_blog_id;
mod update;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use create::*;
pub use delete::*;
pub use get_by_blog_id::*;
pub use update::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/comment/{id}", routing::delete(delete).put(update))
        .route(
            "/blog/{id}/comment",
            routing::post(create).get(get_by_blog_id),
        )
}
