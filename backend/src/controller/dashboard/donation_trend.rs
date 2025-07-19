use std::sync::Arc;

use axum::{Json, extract::State};
use chrono::{DateTime, Utc};
use ctypes::Role;
use database::queries::{self};

use crate::{
    state::ApiState,
    util::auth::{Claims, authorize},
};

use crate::error::{Error, Result};

#[utoipa::path(
    get,
    tag = "Dashboard",
    path = "/dashboard/trend/donation",
    operation_id = "dashboard::donation_trend",
    security(("jwt_token" = []))
)]
pub async fn donation_trend(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<DateTime<Utc>>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Admin], &database).await?;

    match queries::dashboard::get_donation_trend()
        .bind(&database)
        .all()
        .await
    {
        Ok(trend) => {
            let trend_utc = trend.into_iter().map(|dt| dt.with_timezone(&Utc)).collect();

            Ok(Json(trend_utc))
        }
        Err(error) => {
            tracing::error!(?error, "Failed to get dashboard donation trend");

            Err(Error::internal())
        }
    }
}
