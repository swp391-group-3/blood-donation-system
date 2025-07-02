pub mod bcrypt;
pub mod cors;
pub mod email;
pub mod jwt;
pub mod oidc;
#[cfg(feature = "rag")]
pub mod rag;

use std::sync::LazyLock;

use cors::CorsConfig;
use email::EmailConfig;
use oidc::OpenIdConnectConfig;
use serde::Deserialize;

use crate::config::{bcrypt::BcryptConfig, jwt::JwtConfig};

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

    pub jwt: JwtConfig,

    pub oidc: OpenIdConnectConfig,

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
