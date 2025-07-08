pub mod bcrypt;
pub mod cors;
pub mod email;
pub mod jwt;
pub mod oidc;

#[cfg(feature = "rag")]
pub mod rag;

#[cfg(feature = "redis")]
pub mod redis;

#[cfg(feature = "cron-job")]
pub mod blood_threshold;
#[cfg(feature = "cron-job")]
pub mod schedule_time;

use std::sync::LazyLock;

use cors::CorsConfig;
use email::EmailConfig;
use oidc::OpenIdConnectConfig;
use serde::Deserialize;

use bcrypt::BcryptConfig;
use jwt::JwtConfig;

#[cfg(feature = "rag")]
use rag::RAGConfig;

#[cfg(feature = "redis")]
use redis::RedisConfig;

#[cfg(feature = "cron-job")]
use blood_threshold::BloodThresholdConfig;
#[cfg(feature = "cron-job")]
use schedule_time::ScheduleTimeConfig;

const fn default_port() -> u16 {
    3000
}

#[cfg(feature = "monitoring")]
const fn default_prometheus_port() -> u16 {
    3001
}

#[derive(Debug, Deserialize)]
pub struct Config {
    pub database_url: String,

    #[serde(default = "default_port")]
    pub port: u16,

    #[cfg(feature = "monitoring")]
    #[serde(default = "default_prometheus_port")]
    pub prometheus_port: u16,

    pub cors: CorsConfig,

    pub bcrypt: BcryptConfig,

    pub jwt: JwtConfig,

    pub oidc: OpenIdConnectConfig,

    pub email: EmailConfig,

    #[cfg(feature = "rag")]
    pub rag: RAGConfig,

    #[cfg(feature = "cron-job")]
    #[serde(default)]
    pub blood: BloodThresholdConfig,

    #[cfg(feature = "cron-job")]
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
