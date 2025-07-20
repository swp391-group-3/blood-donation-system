use std::sync::Arc;

use axum::{
    Json,
    extract::{Query, State},
};
use ctypes::{BloodComponent, BloodGroup, Role};
use database::queries::{self, blood_bag::BloodBag};
use serde::Deserialize;
use utoipa::{IntoParams, ToSchema};

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::{
        auth::{Claims, authorize},
        pagination::{self, Pagination},
    },
};

#[derive(Deserialize, ToSchema)]
pub enum Mode {
    Exact,
    Compatible,
}

fn default_mode() -> Mode {
    Mode::Compatible
}

impl Mode {
    pub fn as_str(&self) -> &'static str {
        match self {
            Mode::Exact => "Exact",
            Mode::Compatible => "Compatible",
        }
    }
}

#[derive(Deserialize, IntoParams)]
#[into_params(parameter_in = Query)]
pub struct Request {
    pub component: Option<BloodComponent>,

    pub blood_group: Option<BloodGroup>,

    #[serde(default = "default_mode")]
    pub mode: Mode,

    #[serde(default = "pagination::default_page_size")]
    pub page_size: usize,

    #[serde(default = "pagination::default_page_index")]
    pub page_index: usize,
}

#[utoipa::path(
    get,
    tag = "Blood Bag",
    path = "/blood-bag",
    operation_id = "blood_bag::get_all",
    params(Request),
    responses(
        (status = StatusCode::OK, body = Pagination<BloodBag>)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_all(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Query(request): Query<Request>,
) -> Result<Json<Pagination<BloodBag>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    let queries_result = tokio::try_join! {
        async {
            queries::blood_bag::get_all()
                .bind(
                    &database,
                    &request.component,
                    &request.blood_group,
                    &request.mode.as_str(),
                    &(request.page_size as i32),
                    &(request.page_index as i32),
                )
                .all()
                .await
        },
        async {
            queries::blood_bag::count()
                .bind(
                    &database,
                    &request.component,
                    &request.blood_group,
                    &request.mode.as_str(),
                )
                .one()
                .await
        }
    };

    match queries_result {
        Ok((blood_bags, count)) => Ok(Json(Pagination {
            element_count: count as usize,
            data: blood_bags,
        })),
        Err(error) => {
            tracing::error!(?error, "Failed to get blood bag list");

            Err(Error::internal())
        }
    }
}
