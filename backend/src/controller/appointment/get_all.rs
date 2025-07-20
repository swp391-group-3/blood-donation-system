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
        pagination::{self, Pagination},
    },
};

#[derive(Deserialize, IntoParams)]
#[into_params(parameter_in = Query)]
pub struct Request {
    pub query: Option<String>,

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
        (status = Status::OK, body = Pagination<Appointment>)
    ),
    params(Request),
    security(("jwt_token" = []))
)]
pub async fn get_all(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Query(request): Query<Request>,
) -> Result<Json<Pagination<Appointment>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    let queries_result = tokio::try_join! {
        async {
            queries::appointment::get_all()
                .bind(
                    &database,
                    &request.query,
                    &request.status,
                    &(request.page_size as i32),
                    &(request.page_index as i32),
                )
                .all()
                .await
        },
        async {
            queries::appointment::count()
                .bind(
                    &database,
                    &request.query,
                    &request.status,
                )
                .one()
                .await
        }
    };

    match queries_result {
        Ok((appointments, count)) => Ok(Json(Pagination {
            element_count: count as usize,
            data: appointments,
        })),
        Err(error) => {
            tracing::error!(?error, "Failed to get appointment list");

            Err(Error::internal())
        }
    }
}
