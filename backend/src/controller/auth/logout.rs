use axum_extra::extract::{CookieJar, cookie::Cookie};
use tower_sessions::cookie::SameSite;

use crate::{error::Result, util::auth::TOKEN_KEY};

#[utoipa::path(post, tag = "Auth", path = "/auth/logout")]
pub async fn logout(jar: CookieJar) -> Result<CookieJar> {
    let mut cookie = Cookie::new(TOKEN_KEY, "");
    cookie.set_same_site(SameSite::Lax);
    cookie.set_path("/");
    cookie.make_removal();

    Ok(jar.remove(cookie))
}
