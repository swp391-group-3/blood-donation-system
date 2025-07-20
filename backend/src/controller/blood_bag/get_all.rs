use std::sync::Arc;

use axum::{
    Json,
    extract::{Query, State},
};
use ctypes::{BloodComponent, BloodGroup, Role};
use database::{
    client::Params,
    queries::{
        self,
        blood_bag::{BloodBag, GetAllParams},
    },
};
use serde::Deserialize;
use utoipa::{IntoParams, ToSchema};

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::{
        auth::{Claims, authorize},
        pagination,
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
    security(("jwt_token" = []))
)]
pub async fn get_all(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Query(request): Query<Request>,
) -> Result<Json<Vec<BloodBag>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    match queries::blood_bag::get_all()
        .params(
            &database,
            &GetAllParams {
                component: request.component,
                blood_group: request.blood_group,
                mode: request.mode.as_str(),
                page_size: request.page_size as i32,
                page_index: request.page_index as i32,
            },
        )
        .all()
        .await
    {
        Ok(blood_bags) => Ok(Json(blood_bags)),
        Err(error) => {
            tracing::error!(?error, "Failed to get blood bag list");

            Err(Error::internal())
        }
    }
}
