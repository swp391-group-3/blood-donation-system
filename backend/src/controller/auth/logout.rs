use axum::http::StatusCode;
use axum_extra::extract::CookieJar;

use crate::{
    error::{Error, Result},
    util::auth::TOKEN_KEY,
};

#[utoipa::path(post, tag = "Auth", path = "/auth/logout")]
pub async fn logout(jar: CookieJar) -> Result<CookieJar> {
    let mut cookie = match jar.get(TOKEN_KEY) {
        Some(v) => v.clone(),
        None => {
            tracing::warn!("Trying to logout before login");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Login first before logout".into())
                .build());
        }
    };
    cookie.set_path("/");
    cookie.make_removal();

    Ok(jar.remove(cookie))
}
