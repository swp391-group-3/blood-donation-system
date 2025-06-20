use serde::Deserialize;

fn default_email() -> String {
    String::from("baotochi87@gmail.com")
}

fn default_password() -> String {
    String::from("iriq hnog geoy qihf")
}
#[derive(Debug, Deserialize)]
pub struct EmailConfig {
    #[serde(default = "default_email")]
    pub username: String,
    #[serde(default = "default_password")]
    pub password: String,
}
