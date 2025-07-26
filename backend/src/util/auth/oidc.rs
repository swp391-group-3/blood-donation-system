use axum::http::StatusCode;
use openidconnect::{
    AuthenticationFlow, AuthorizationCode, CsrfToken, EndpointMaybeSet, EndpointNotSet,
    EndpointSet, Nonce, ProviderMetadataDiscoveryOptions, Scope,
    core::{
        CoreClient, CoreIdTokenClaims, CoreIdTokenVerifier, CoreProviderMetadata, CoreResponseType,
    },
    reqwest,
    url::Url,
};

use crate::{
    config::oidc::OpenIdConnectClientConfig,
    error::{Error, Result},
};

type InnerClient = CoreClient<
    EndpointSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointMaybeSet,
    EndpointMaybeSet,
>;

pub struct OpenIdConnectClient {
    inner_client: InnerClient,
    http_client: reqwest::Client,
}

impl OpenIdConnectClient {
    pub async fn from_config(config: OpenIdConnectClientConfig) -> Self {
        let http_client = reqwest::ClientBuilder::new()
            .redirect(reqwest::redirect::Policy::none())
            .build()
            .unwrap();

        let provider_metadata = CoreProviderMetadata::discover_async_with_options(
            config.issuer_url,
            &http_client,
            ProviderMetadataDiscoveryOptions::default().validate_issuer_url(false),
        )
        .await
        .unwrap();

        let inner_client = CoreClient::from_provider_metadata(
            provider_metadata,
            config.client_id,
            Some(config.client_secret),
        )
        .set_redirect_uri(config.redirect_url);

        Self {
            inner_client,
            http_client,
        }
    }

    pub fn generate(&self) -> (Url, CsrfToken, Nonce) {
        self.inner_client
            .authorize_url(
                AuthenticationFlow::<CoreResponseType>::AuthorizationCode,
                CsrfToken::new_random,
                Nonce::new_random,
            )
            .add_scope(Scope::new("email".to_string()))
            .add_scope(Scope::new("profile".to_string()))
            .url()
    }

    pub async fn get_claims(
        &self,
        code: AuthorizationCode,
        state: CsrfToken,
        csrf: CsrfToken,
        nonce: Nonce,
    ) -> Result<CoreIdTokenClaims> {
        if state.secret() != csrf.secret() {
            return Err(Error::builder()
                .status(StatusCode::FORBIDDEN)
                .message("CSRF token not matched".into())
                .build());
        }

        let token_exchange_request = match self.inner_client.exchange_code(code) {
            Ok(request) => request,
            Err(error) => {
                tracing::error!(?error, "Failed to create token exchange request");

                return Err(Error::internal());
            }
        };

        let token_response = match token_exchange_request
            .request_async(&self.http_client)
            .await
        {
            Ok(response) => response,
            Err(error) => {
                tracing::error!(?error, "Failed to exchange token");

                return Err(Error::internal());
            }
        };

        let id_token_verifier: CoreIdTokenVerifier = self
            .inner_client
            .id_token_verifier()
            .require_issuer_match(false);
        let id_token = match token_response.extra_fields().id_token() {
            Some(id_token) => id_token,
            None => {
                tracing::error!("Token exchange return empty token");

                return Err(Error::internal());
            }
        };
        let claims = match id_token.claims(&id_token_verifier, &nonce) {
            Ok(claims) => claims,
            Err(error) => {
                tracing::error!(?error, "Failed to decode claims");

                return Err(Error::internal());
            }
        };

        Ok(claims.clone())
    }
}
