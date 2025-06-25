use axum_extra::extract::{CookieJar, cookie::Cookie};
use tower_sessions::cookie::SameSite;

use crate::{config::CONFIG, error::Result};

#[utoipa::path(post, tag = "Auth", path = "/auth/logout")]
pub async fn logout(jar: CookieJar) -> Result<CookieJar> {
    let mut cookie = Cookie::new(CONFIG.jwt.token_key.clone(), "");
    cookie.make_removal();
    cookie.set_same_site(SameSite::Lax);
    cookie.set_path("/");

    Ok(jar.remove(cookie))
}
