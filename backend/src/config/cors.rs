use serde::Deserialize;

fn default_frontend_dev_origin() -> String {
    "http://localhost:3000".to_string()
}

fn default_frontend_origin() -> String {
    "http://frontend:3000".to_string()
}

#[derive(Debug, Deserialize)]
pub struct CorsConfig {
    #[serde(default = "default_frontend_dev_origin")]
    pub frontend_dev_origin: String,

    #[serde(default = "default_frontend_origin")]
    pub frontend_origin: String,
}

impl Default for CorsConfig {
    fn default() -> Self {
        Self {
            frontend_dev_origin: default_frontend_dev_origin(),
            frontend_origin: default_frontend_origin(),
        }
    }
}
