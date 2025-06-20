use std::sync::Arc;

use axum::{
    extract::{Path, Query, State},
    response::{IntoResponse, Redirect},
};
use axum_extra::extract::CookieJar;
use database::queries;
use openidconnect::{AuthorizationCode, CsrfToken, Nonce};
use serde::Deserialize;
use tower_sessions::Session;

use crate::{
    config::{CONFIG, oidc::Provider},
    error::{AuthError, Result},
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
    let database = state.database_pool.get().await?;

    let (csrf, nonce): (CsrfToken, Nonce) = session.remove(KEY).await.unwrap().unwrap();

    let claims = state.oidc_clients[&provider]
        .get_claims(
            AuthorizationCode::new(query.code),
            CsrfToken::new(query.state),
            csrf,
            nonce,
        )
        .await
        .unwrap();

    tracing::info!(claims =? claims);

    let email = claims.email().expect("Account must have email").as_str();

    if let Some(account) = queries::account::get_by_email()
        .bind(&database, &email)
        .opt()
        .await?
    {
        let id = account.id;

        let cookie = state.jwt_service.new_credential(id).map_err(|error| {
            tracing::error!(error =? error);
            AuthError::InvalidAuthToken
        })?;

        return Ok((jar.add(cookie), Redirect::to(&CONFIG.frontend_url)));
    }

    session.insert(KEY, email).await.unwrap();

    Ok((
        jar,
        Redirect::to(&format!("{}/auth/complete", CONFIG.frontend_url)),
    ))
}
