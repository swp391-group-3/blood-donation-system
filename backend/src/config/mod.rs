pub mod bcrypt;
pub mod cors;
pub mod email;
pub mod jwt;
pub mod oidc;
#[cfg(feature = "rag")]
pub mod rag;

use std::{collections::HashMap, sync::LazyLock};

use cors::CorsConfig;
use email::EmailConfig;
use oidc::Provider;
use serde::Deserialize;

use crate::config::{bcrypt::BcryptConfig, jwt::JwtConfig, oidc::OpenIdConnectConfig};

#[cfg(feature = "rag")]
use crate::config::rag::RAGConfig;

const fn default_port() -> u16 {
    3000
}

#[derive(Debug, Deserialize)]
pub struct Config {
    pub database_url: String,
    #[serde(default = "default_port")]
    pub port: u16,

    #[serde(default)]
    pub cors: CorsConfig,
    pub bcrypt: BcryptConfig,
    #[serde(default)]
    pub jwt: JwtConfig,
    #[serde(default)]
    pub oidc: HashMap<Provider, OpenIdConnectConfig>,
    #[serde(default)]
    pub email: EmailConfig,
    #[cfg(feature = "rag")]
    pub rag: RAGConfig,
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| {
    ::config::Config::builder()
        .add_source(::config::File::with_name("config").required(false))
        .add_source(
            ::config::Environment::default()
                .try_parsing(true)
                .separator("__"),
        )
        .build()
        .unwrap()
        .try_deserialize()
        .unwrap()
});
