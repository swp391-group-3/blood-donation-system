use serde::Deserialize;

fn default_frontend_dev_origin() -> String {
    "http://localhost:3000".to_string()
}

#[derive(Debug, Deserialize)]
pub struct CorsConfig {
    #[serde(default = "default_frontend_dev_origin")]
    pub frontend_dev_origin: String,

    pub frontend_origin: String,
}
