use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct BcryptConfig {
    pub cost: u32,
    pub salt: [u8; 16],
}
