mod login;
mod logout;
mod me;
pub mod oauth2;
mod register;

use std::sync::Arc;

use axum::{Router, routing};

use crate::state::ApiState;

pub use login::*;
pub use logout::*;
pub use me::*;
pub use register::*;

pub fn build() -> Router<Arc<ApiState>> {
    Router::new()
        .route("/auth/register", routing::post(register))
        .route("/auth/login", routing::post(login))
        .route("/auth/logout", routing::post(logout))
        .route("/oauth2/{provider}", routing::get(oauth2::oauth2))
        .route(
            "/oauth2/{provider}/authorized",
            routing::get(oauth2::authorized),
        )
        .route("/oauth2/complete", routing::post(oauth2::complete))
        .route("/auth/me", routing::get(me))
}
