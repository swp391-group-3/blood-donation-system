mod create;
mod get;
mod get_all;
mod get_by_appointment_id;
mod get_by_donor_id;
mod update;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use create::*;
pub use get::*;
pub use get_all::*;
pub use get_by_appointment_id::*;
pub use get_by_donor_id::*;
pub use update::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/appointment/{id}/donation", routing::post(create))
        .route(
            "/appointment/{id}/donation",
            routing::get(get_by_appointment_id),
        )
        .route("/donation/{id}", routing::get(get))
        .route("/donation", routing::get(get_all))
        .route("/donation/{id}", routing::patch(update))
        .route("/donation/me", routing::get(get_by_donor_id))
}
