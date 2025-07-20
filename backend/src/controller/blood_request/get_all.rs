use std::sync::Arc;

use axum::{
    Json,
    extract::{Query, State},
};
use ctypes::{BloodGroup, RequestPriority};
use database::{
    client::Params,
    queries::{
        self,
        blood_request::{BloodRequest, GetAllParams},
    },
};
use serde::Deserialize;
use utoipa::IntoParams;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::{
        auth::Claims,
        pagination::{self, Pagination},
    },
};

#[derive(Deserialize, IntoParams)]
#[into_params(parameter_in = Query)]
pub struct Request {
    pub query: Option<String>,

    pub priority: Option<RequestPriority>,

    pub blood_group: Option<BloodGroup>,

    #[serde(default = "pagination::default_page_size")]
    pub page_size: usize,

    #[serde(default = "pagination::default_page_index")]
    pub page_index: usize,
}

#[utoipa::path(
    get,
    tag = "Blood Request",
    path = "/blood-request",
    params(Request),
    responses(
        (status = StatusCode::OK, body = Pagination<BloodRequest>)
    ),
    operation_id = "blood_request::get_all"
)]
pub async fn get_all(
    state: State<Arc<ApiState>>,
    claims: Option<Claims>,
    Query(request): Query<Request>,
) -> Result<Json<Pagination<BloodRequest>>> {
    let database = state.database().await?;

    let sub = claims.map(|c| c.sub).unwrap_or_else(uuid::Uuid::nil);

    let queries_result = tokio::try_join! {
        async {
            queries::blood_request::get_all()
                .bind(
                    &database,
                    &sub,
                    &request.query,
                    &request.priority,
                    &request.blood_group,
                    &(request.page_size as i32),
                    &(request.page_index as i32),
                )
                .all()
                .await
        },
        async {
            queries::blood_request::count()
                .bind(
                    &database,
                    &sub,
                    &request.query,
                    &request.priority,
                    &request.blood_group,
                )
                .one()
                .await
        }
    };

    match queries_result {
        Ok((requests, count)) => Ok(Json(Pagination {
            element_count: count as usize,
            data: requests,
        })),
        Err(error) => {
            tracing::error!(?error, "Failed to get request list");

            Err(Error::internal())
        }
    }
}
