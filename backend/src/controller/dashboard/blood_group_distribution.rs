use std::sync::Arc;

use axum::{Json, extract::State};
use ctypes::Role;
use database::queries::{self, dashboard::BloodGroup};

use crate::{
    state::ApiState,
    util::auth::{Claims, authorize},
};

use crate::error::{Error, Result};

#[utoipa::path(
    get,
    tag = "Dashboard",
    path = "/dashboard/blood-group-distribution",
    operation_id = "dashboard::blood_group_distribution",
    security(("jwt_token" = []))
)]
pub async fn blood_group_distribution(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<BloodGroup>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Admin], &database).await?;

    match queries::dashboard::get_blood_group_distribution()
        .bind(&database)
        .all()
        .await
    {
        Ok(blood_group) => Ok(Json(blood_group)),
        Err(error) => {
            tracing::error!(?error, "Failed to get dashboard blood group distribution");

            Err(Error::internal())
        }
    }
}
