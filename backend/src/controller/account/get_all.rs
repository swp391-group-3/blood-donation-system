use std::sync::Arc;

use axum::{
    Json,
    extract::{Query, State},
};
use ctypes::Role;
use database::{
    client::Params,
    queries::{
        self,
        account::{Account, GetAllParams},
    },
};
use serde::Deserialize;
use utoipa::IntoParams;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::{
        auth::{Claims, authorize},
        pagination,
    },
};

#[derive(Deserialize, IntoParams)]
#[into_params(parameter_in = Query)]
pub struct Request {
    #[param(required = false)]
    pub query: Option<String>,

    #[param(required = false)]
    pub role: Option<Role>,

    #[serde(default = "pagination::default_page_size")]
    pub page_size: usize,

    #[serde(default = "pagination::default_page_index")]
    pub page_index: usize,
}

#[utoipa::path(
    get,
    tag = "Account",
    path = "/account",
    operation_id = "account::get_all",
    params(Request),
    security(("jwt_token" = []))
)]
pub async fn get_all(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Query(request): Query<Request>,
) -> Result<Json<Vec<Account>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Admin], &database).await?;

    match queries::account::get_all()
        .params(
            &database,
            &GetAllParams {
                query: request.query,
                role: request.role,
                page_size: request.page_size as i32,
                page_index: request.page_index as i32,
            },
        )
        .all()
        .await
    {
        Ok(accounts) => Ok(Json(accounts)),
        Err(error) => {
            tracing::error!(?error, "Failed to get account list");

            Err(Error::internal())
        }
    }
}
