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
        account::{Account, CountParams, GetAllParams},
    },
};
use serde::Deserialize;
use utoipa::IntoParams;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::{
        auth::{Claims, authorize},
        pagination::{self, Pagination},
    },
};

#[derive(Deserialize, IntoParams)]
#[into_params(parameter_in = Query)]
pub struct Request {
    pub query: Option<String>,

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
    responses(
        (status = StatusCode::OK, body = Pagination<Account>),
    ),
    security(("jwt_token" = []))
)]
pub async fn get_all(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Query(request): Query<Request>,
) -> Result<Json<Pagination<Account>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Admin], &database).await?;

    let queries_result = tokio::try_join! {
        async {
            queries::account::get_all()
                .bind(
                    &database,
                    &request.query,
                    &request.role,
                    &(request.page_size as i32),
                    &(request.page_index as i32),
                )
                .all()
                .await
        },
        async {
            queries::account::count()
                .bind(
                    &database,
                    &request.query,
                    &request.role,
                )
                .one()
                .await
        }
    };

    match queries_result {
        Ok((accounts, count)) => Ok(Json(Pagination {
            element_count: count as usize,
            data: accounts,
        })),
        Err(error) => {
            tracing::error!(?error, "Failed to get account list");

            Err(Error::internal())
        }
    }
}
