use axum::{
    Json,
    extract::{Query, State},
};
use database::queries::{self, blog::Blog};
use serde::Deserialize;
use std::sync::Arc;
use utoipa::{IntoParams, ToSchema};

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::pagination::{self, Pagination},
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
        (status = 200, description = "Get Blog Successfully", body = Pagination<Blog>)
    )
)]
pub async fn get_all(
    state: State<Arc<ApiState>>,
    Query(request): Query<Request>,
) -> Result<Json<Pagination<Blog>>> {
    let database = state.database().await?;

    let queries_result = tokio::try_join! {
        async {
            queries::blog::get_all()
                .bind(
                    &database,
                    &request.query,
                    &request.tag,
                    &request.mode.as_str(),
                    &(request.page_size as i32),
                    &(request.page_index as i32),
                )
                .all()
                .await
        },
        async {
            queries::blog::count()
                .bind(
                    &database,
                    &request.query,
                    &request.tag,
                )
                .one()
                .await
        }
    };

    match queries_result {
        Ok((blogs, count)) => Ok(Json(Pagination {
            element_count: count as usize,
            data: blogs,
        })),
        Err(error) => {
            tracing::error!(?error, "Failed to get blog list");

            Err(Error::internal())
        }
    }
}
