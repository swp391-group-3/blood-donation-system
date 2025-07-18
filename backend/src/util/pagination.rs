use serde::Deserialize;
use utoipa::ToSchema;

const fn default_page_size() -> usize {
    10
}

const fn default_page_index() -> usize {
    0
}

#[derive(Deserialize, ToSchema)]
pub struct Pagination {
    #[serde(default = "default_page_size")]
    page_size: usize,

    #[serde(default = "default_page_index")]
    page_index: usize,
}

impl Default for Pagination {
    fn default() -> Self {
        Self {
            page_size: default_page_size(),
            page_index: default_page_index(),
        }
    }
}
