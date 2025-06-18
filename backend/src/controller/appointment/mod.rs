mod create;
mod get;
mod get_answer;

use std::sync::Arc;

use axum::{Router, routing};
use ctypes::Role;

use crate::{middleware, state::ApiState};

pub use create::*;
pub use get::*;
pub use get_answer::*;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    let staff_router = Router::new()
        .route("/appointment/{id}/answer", routing::get(get_answer))
        .route("/appointment/{id}", routing::get(get))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            middleware::authorize!(Role::Staff),
        ));

    Router::new().merge(staff_router).route(
        "/blood-request/{id}/create-appointment",
        routing::post(create),
    )
}
