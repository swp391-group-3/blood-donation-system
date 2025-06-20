use serde::Deserialize;

#[derive(Debug, Deserialize, Default)]
pub struct EmailConfig {
    pub username: String,
    pub password: String,
}
