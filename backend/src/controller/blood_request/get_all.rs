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
    util::{auth::Claims, pagination},
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
    operation_id = "blood_request::get_all"
)]
pub async fn get_all(
    state: State<Arc<ApiState>>,
    claims: Option<Claims>,
    Query(request): Query<Request>,
) -> Result<Json<Vec<BloodRequest>>> {
    let database = state.database().await?;

    let account_id = claims.map(|c| c.sub).unwrap_or_else(uuid::Uuid::nil);

    match queries::blood_request::get_all()
        .params(
            &database,
            &GetAllParams {
                account_id: account_id,
                query: request.query,
                priority: request.priority,
                blood_group: request.blood_group,
                page_size: request.page_size as i32,
                page_index: request.page_index as i32,
            },
        )
        .all()
        .await
    {
        Ok(requests) => Ok(Json(requests)),
        Err(error) => {
            tracing::error!(?error, "Failed to get request list");

            Err(Error::internal())
        }
    }
}
