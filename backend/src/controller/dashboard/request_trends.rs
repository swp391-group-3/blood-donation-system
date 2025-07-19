use std::sync::Arc;

use axum::{Json, extract::State};
use ctypes::Role;
use database::queries::{self, dashboard::RequestTrends};

use crate::{
    state::ApiState,
    util::auth::{Claims, authorize},
};

use crate::error::{Error, Result};

#[utoipa::path(
    get,
    tag = "Dashboard",
    path = "/dashboard/request-trends",
    operation_id = "dashboard::request_trends",
    security(("jwt_token" = []))
)]
pub async fn request_trends(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<RequestTrends>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Admin], &database).await?;

    match queries::dashboard::get_request_trends()
        .bind(&database)
        .all()
        .await
    {
        Ok(trend) => Ok(Json(trend)),
        Err(error) => {
            tracing::error!(?error, "Failed to get dashboard request trends");

            Err(Error::internal())
        }
    }
}
