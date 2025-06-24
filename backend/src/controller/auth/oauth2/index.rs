use std::sync::Arc;

use axum::{
    extract::{Path, State},
    response::Redirect,
};
use tower_sessions::Session;

use crate::{
    config::oidc::Provider,
    error::{Error, Result},
    state::ApiState,
};

use super::KEY;

#[utoipa::path(
    get,
    tag = "Auth",
    path = "/oauth2/{provider}",
    params(
        ("provider" = Provider, description = "OAuth2 Provider"),
    ),
)]
#[axum::debug_handler]
pub async fn oauth2(
    state: State<Arc<ApiState>>,
    session: Session,
    Path(provider): Path<Provider>,
) -> Result<Redirect> {
    let (auth_url, csrf, nonce) = state.oidc_clients[&provider].generate();

    if let Err(error) = session.insert(KEY, (csrf, nonce)).await {
        tracing::error!(?error, "Failed to create oauth2 session");

        return Err(Error::internal());
    }

    Ok(Redirect::to(auth_url.as_ref()))
}
