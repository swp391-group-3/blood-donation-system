use serde::Deserialize;

const fn default_port() -> u16 {
    6379
}

const fn default_pool_size() -> usize {
    6
}

#[derive(Debug, Clone, Deserialize)]
pub struct RedisConfig {
    pub host: String,

    #[serde(default = "default_port")]
    pub port: u16,

    pub password: String,

    #[serde(default = "default_pool_size")]
    pub pool_size: usize,
}
