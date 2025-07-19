use std::sync::Arc;

use axum::{Json, extract::State};
use ctypes::Role;
use database::queries::{self, dashboard::DonationTrend};

use crate::{
    state::ApiState,
    util::auth::{Claims, authorize},
};

use crate::error::{Error, Result};

#[utoipa::path(
    get,
    tag = "Dashboard",
    path = "/dashboard/donation-trends",
    operation_id = "dashboard::donation_trends",
    security(("jwt_token" = []))
)]
pub async fn donation_trends(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<DonationTrend>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Admin], &database).await?;

    match queries::dashboard::get_donation_trends()
        .bind(&database)
        .all()
        .await
    {
        Ok(trend) => Ok(Json(trend)),
        Err(error) => {
            tracing::error!(?error, "Failed to get dashboard donation trends");

            Err(Error::internal())
        }
    }
}
