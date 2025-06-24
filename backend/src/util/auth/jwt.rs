use std::sync::Arc;

use axum::{
    RequestPartsExt,
    extract::{FromRequestParts, OptionalFromRequestParts},
    http::{StatusCode, request::Parts},
};
use axum_extra::extract::{CookieJar, cookie::Cookie};
use chrono::Local;
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use tower_sessions::cookie::SameSite;
use uuid::Uuid;

use crate::{
    config::CONFIG,
    error::{Error, Result},
    state::ApiState,
};

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,
    pub exp: u64,
}

pub struct JwtService {
    encoding_key: EncodingKey,
    decoding_key: DecodingKey,
}

impl Default for JwtService {
    fn default() -> Self {
        Self {
            encoding_key: EncodingKey::from_secret(CONFIG.jwt.secret.as_bytes()),
            decoding_key: DecodingKey::from_secret(CONFIG.jwt.secret.as_bytes()),
        }
    }
}

impl JwtService {
    pub fn new_credential(&self, id: Uuid) -> Result<Cookie<'static>> {
        let now = Local::now().timestamp() as u64;

        let claims = Claims {
            sub: id,
            exp: now + CONFIG.jwt.expired_in,
        };

        let token = match jsonwebtoken::encode(&Header::default(), &claims, &self.encoding_key) {
            Ok(token) => token,
            Err(error) => {
                tracing::error!(?error, "Failed to generate token");

                return Err(Error::internal());
            }
        };

        let mut cookie = Cookie::new(CONFIG.jwt.token_key.clone(), token);
        // cookie.set_secure(true);
        cookie.set_same_site(SameSite::Lax);
        // cookie.set_http_only(true);
        cookie.set_path("/");

        Ok(cookie)
    }
}

impl FromRequestParts<Arc<ApiState>> for Claims {
    type Rejection = Error;

    async fn from_request_parts(parts: &mut Parts, state: &Arc<ApiState>) -> Result<Self> {
        let jar = parts.extract::<CookieJar>().await.unwrap();
        let token = match jar.get(&CONFIG.jwt.token_key) {
            Some(token) => token.value(),
            None => {
                tracing::warn!("No cookie founded");
                return Err(Error::builder()
                    .status(StatusCode::UNAUTHORIZED)
                    .message("No cookie founded".into())
                    .build());
            }
        };

        let token = match jsonwebtoken::decode::<Claims>(
            token,
            &state.jwt_service.decoding_key,
            &Validation::default(),
        ) {
            Ok(token) => token,
            Err(error) => {
                tracing::warn!("Failed to decode token: {} with error: {:#?}", token, error);

                return Err(Error::builder()
                    .status(StatusCode::UNAUTHORIZED)
                    .message("Invalid token".into())
                    .build());
            }
        };

        Ok(token.claims)
    }
}

impl OptionalFromRequestParts<Arc<ApiState>> for Claims {
    type Rejection = Error;

    async fn from_request_parts(parts: &mut Parts, state: &Arc<ApiState>) -> Result<Option<Self>> {
        Ok(parts
            .extract_with_state::<Claims, Arc<ApiState>>(state)
            .await
            .ok())
    }
}
