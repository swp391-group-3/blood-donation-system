use std::sync::Arc;

use axum::{
    Json,
    extract::{Query, State},
};
use ctypes::{AppointmentStatus, Role};
use database::{
    client::Params,
    queries::{
        self,
        appointment::{Appointment, GetAllParams},
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
    pub status: Option<AppointmentStatus>,

    #[serde(default = "pagination::default_page_size")]
    pub page_size: usize,

    #[serde(default = "pagination::default_page_index")]
    pub page_index: usize,
}

#[utoipa::path(
    get,
    tag = "Appointment",
    path = "/appointment",
    operation_id = "appointment::get_all",
    responses(
        (status = Status::OK, body = Appointment)
    ),
    params(Request),
    security(("jwt_token" = []))
)]
pub async fn get_all(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Query(request): Query<Request>,
) -> Result<Json<Vec<Appointment>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    let appointments = match queries::appointment::get_all()
        .params(
            &database,
            &GetAllParams {
                query: request.query,
                status: request.status,
                page_size: request.page_size as i32,
                page_index: request.page_index as i32,
            },
        )
        .all()
        .await
    {
        Ok(appointments) => appointments,
        Err(error) => {
            tracing::error!(?error, "Failed to get appointment list");

            return Err(Error::internal());
        }
    };

    Ok(Json(appointments))
}
