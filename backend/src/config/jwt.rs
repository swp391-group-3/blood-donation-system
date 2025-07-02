use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct JwtConfig {
    pub secret: String,
    pub expired_in: u64,
    pub token_key: String,
}
