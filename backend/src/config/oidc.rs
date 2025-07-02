use std::collections::HashMap;

use openidconnect::{ClientId, ClientSecret, IssuerUrl, RedirectUrl};
use serde::Deserialize;
use utoipa::ToSchema;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum Provider {
    Google,
    Microsoft,
}

#[derive(Debug, Clone, Deserialize)]
pub struct OpenIdConnectClientConfig {
    pub client_id: ClientId,
    pub client_secret: ClientSecret,
    pub issuer_url: IssuerUrl,
    pub redirect_url: RedirectUrl,
}

#[derive(Debug, Clone, Deserialize)]
pub struct OpenIdConnectConfig {
    pub clients: HashMap<Provider, OpenIdConnectClientConfig>,
    pub login_redirect: String,
    pub register_redirect: String,
}
