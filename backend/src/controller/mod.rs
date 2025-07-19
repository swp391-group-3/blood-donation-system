pub mod account;
pub mod appointment;
pub mod auth;
pub mod blog;
pub mod blood_bag;
pub mod blood_request;
#[cfg(feature = "rag")]
pub mod chat;
pub mod comment;
pub mod dashboard;
pub mod donation;
pub mod health;
mod ping;
pub mod question;

use std::sync::Arc;

use axum::{Router, routing};
pub use ping::*;

use super::state::ApiState;

pub fn build() -> Router<Arc<ApiState>> {
    let router = Router::new()
        .route("/", routing::get(ping))
        .merge(auth::build())
        .merge(blog::build())
        .merge(comment::build())
        .merge(account::build())
        .merge(question::build())
        .merge(blood_request::build())
        .merge(appointment::build())
        .merge(health::build())
        .merge(blood_bag::build())
        .merge(donation::build())
        .merge(dashboard::build());

    #[cfg(feature = "rag")]
    let router = router.merge(chat::build());

    router
}
