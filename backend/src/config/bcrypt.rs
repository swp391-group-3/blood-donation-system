use serde::Deserialize;
use serde_with::{Bytes, serde_as};

#[serde_as]
#[derive(Debug, Deserialize)]
pub struct BcryptConfig {
    pub cost: u32,
    #[serde_as(as = "Bytes")]
    pub salt: [u8; 16],
}
