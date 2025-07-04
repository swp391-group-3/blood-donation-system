mod create_staff;
mod delete;
mod get;
mod get_all;
mod is_donatable;
mod update;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use create_staff::*;
pub use delete::*;
pub use get::*;
pub use get_all::*;
pub use is_donatable::*;
pub use update::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/account/create-staff", routing::post(create_staff))
        .route("/account", routing::get(get_all))
        .route("/account/{id}", routing::delete(delete))
        .route("/account", routing::put(update))
        .route("/account/{id}", routing::get(get))
        .route("/account/is-donatable", routing::get(is_donatable))
}
