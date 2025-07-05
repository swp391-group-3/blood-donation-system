pub mod bcrypt;
pub mod blood_threshold;
pub mod cors;
pub mod email;
pub mod jwt;
pub mod oidc;
#[cfg(feature = "rag")]
pub mod rag;
#[cfg(feature = "redis")]
pub mod redis;
pub mod schedule_time;

use std::sync::LazyLock;

use blood_threshold::BloodThresholdConfig;
use cors::CorsConfig;
use email::EmailConfig;
use oidc::OpenIdConnectConfig;
use schedule_time::ScheduleTimeConfig;
use serde::Deserialize;

use crate::config::{bcrypt::BcryptConfig, jwt::JwtConfig};

#[cfg(feature = "rag")]
use crate::config::rag::RAGConfig;

#[cfg(feature = "redis")]
use crate::config::redis::RedisConfig;

const fn default_port() -> u16 {
    3000
}

#[derive(Debug, Deserialize)]
pub struct Config {
    pub database_url: String,
    #[serde(default = "default_port")]
    pub port: u16,

    pub cors: CorsConfig,

    pub bcrypt: BcryptConfig,

    pub jwt: JwtConfig,

    pub oidc: OpenIdConnectConfig,

    pub email: EmailConfig,

    #[cfg(feature = "rag")]
    pub rag: RAGConfig,

    #[serde(default)]
    pub blood: BloodThresholdConfig,

    #[serde(default)]
    pub schedule_time: ScheduleTimeConfig,

    #[cfg(feature = "redis")]
    pub redis: RedisConfig,
}

pub static CONFIG: LazyLock<Config> = LazyLock::new(|| {
    ::config::Config::builder()
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
