use serde::Deserialize;

#[derive(Deserialize)]
pub struct Pagination {
    page_index: usize,
    page_size: usize,
}
