use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct EmailConfig {
    pub username: String,
    pub password: String,
}
