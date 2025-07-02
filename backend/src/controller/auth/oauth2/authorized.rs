use std::sync::Arc;

use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Redirect},
};
use axum_extra::extract::CookieJar;
use database::queries;
use openidconnect::{AuthorizationCode, CsrfToken, Nonce};
use serde::Deserialize;
use tower_sessions::Session;

use crate::{
    config::{CONFIG, oidc::Provider},
    error::{Error, Result},
    state::ApiState,
};

use super::KEY;

#[derive(Debug, Deserialize)]
pub struct AuthRequest {
    pub code: String,
    pub state: String,
}

pub async fn authorized(
    state: State<Arc<ApiState>>,
    session: Session,
    jar: CookieJar,
    Path(provider): Path<Provider>,
    Query(query): Query<AuthRequest>,
) -> Result<impl IntoResponse> {
    let database = state.database().await?;

    let (csrf, nonce): (CsrfToken, Nonce) = match session.remove(KEY).await {
        Ok(Some(value)) => value,
        Ok(None) => {
            tracing::warn!("Failed to get stored session");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid call to oauth2 api".into())
                .build());
        }
        Err(error) => {
            tracing::error!(?error, "Session is not initialized");

            return Err(Error::internal());
        }
    };

    let claims = state.oidc_clients[&provider]
        .get_claims(
            AuthorizationCode::new(query.code),
            CsrfToken::new(query.state),
            csrf,
            nonce,
        )
        .await?;

    tracing::info!(claims =? claims);

    let email = claims.email().expect("Account must have email").as_str();

    let id = match queries::account::get_by_email()
        .bind(&database, &email)
        .opt()
        .await
    {
        Ok(Some(account)) => account.id,
        Ok(None) => {
            session.insert(KEY, email).await.unwrap();

            return Ok((jar, Redirect::to(&CONFIG.oidc.register_redirect)));
        }
        Err(error) => {
            tracing::error!(?error, "Failed to get account");

            return Err(Error::internal());
        }
    };

    let cookie = state.jwt_service.new_credential(id)?;

    Ok((jar.add(cookie), Redirect::to(&CONFIG.oidc.login_redirect)))
}
