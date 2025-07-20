use serde::Serialize;
use utoipa::ToSchema;

pub const fn default_page_size() -> usize {
    10
}

pub const fn default_page_index() -> usize {
    0
}

#[derive(ToSchema, Serialize)]
pub struct Pagination<T: Serialize> {
    pub element_count: usize,
    pub data: Vec<T>,
}
