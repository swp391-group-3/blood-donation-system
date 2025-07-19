use axum::{
    Json,
    extract::{Query, State},
};
use database::{
    client::Params,
    queries::{
        self,
        blog::{Blog, GetAllParams},
    },
};
use serde::Deserialize;
use std::sync::Arc;
use utoipa::{IntoParams, ToSchema};

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::pagination,
};

#[derive(Deserialize, ToSchema)]
pub enum Mode {
    MostRecent,
    OldestFirst,
    TitleAZ,
}

fn default_mode() -> Mode {
    Mode::MostRecent
}

impl Mode {
    pub fn as_str(&self) -> &'static str {
        match self {
            Mode::MostRecent => "Most Recent",
            Mode::OldestFirst => "Oldest First",
            Mode::TitleAZ => "Title A-Z",
        }
    }
}

#[derive(Deserialize, IntoParams)]
#[into_params(parameter_in = Query)]
pub struct Request {
    pub query: Option<String>,

    pub tag: Option<String>,

    #[serde(default = "default_mode")]
    pub mode: Mode,

    #[serde(default = "pagination::default_page_size")]
    pub page_size: usize,

    #[serde(default = "pagination::default_page_index")]
    pub page_index: usize,
}

#[utoipa::path(
    get,
    tag = "Blog",
    path = "/blog",
    params(Request),
    responses(
        (status = 200, description = "Get Blog Successfully", body = Blog)
    )
)]
pub async fn get_all(
    state: State<Arc<ApiState>>,
    Query(request): Query<Request>,
) -> Result<Json<Vec<Blog>>> {
    let database = state.database().await?;

    match queries::blog::get_all()
        .params(
            &database,
            &GetAllParams {
                query: request.query,
                tag: request.tag,
                mode: request.mode.as_str(),
                page_size: request.page_size as i32,
                page_index: request.page_index as i32,
            },
        )
        .all()
        .await
    {
        Ok(blogs) => Ok(Json(blogs)),
        Err(error) => {
            tracing::error!(?error, "Failed to get blog list");

            Err(Error::internal())
        }
    }
}
