pub mod account;
pub mod appointment;
pub mod auth;
pub mod blog;
pub mod blood_bag;
pub mod blood_request;
pub mod comment;
pub mod donation;
pub mod health;
mod ping;
pub mod question;

use std::sync::Arc;

use axum::{Router, routing};
pub use ping::*;

use super::state::ApiState;

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    Router::new()
        .route("/", routing::get(ping))
        .merge(auth::build())
        .merge(blog::build())
        .merge(comment::build(state.clone()))
        .merge(account::build(state.clone()))
        .merge(question::build(state.clone()))
        .merge(blood_request::build(state.clone()))
        .merge(appointment::build(state.clone()))
        .merge(health::build(state.clone()))
        .merge(blood_bag::build(state.clone()))
        .merge(donation::build(state))
}
