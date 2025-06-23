use std::sync::Arc;

use axum::{Json, extract::State};
use ctypes::Role;
use database::queries::{self, donation::Donation};

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    get,
    tag = "Donation",
    path = "/donation/me",
    operation_id = "donation::get_by_member_id",
    responses(
        (status = Status::OK, body = Vec<Donation>)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_by_member_id(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<Donation>>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Member], &database).await?;

    match queries::donation::get_by_member_id()
        .bind(&database, &claims.sub)
        .all()
        .await
    {
        Ok(donations) => Ok(Json(donations)),
        Err(error) => {
            tracing::error!(?error, "Failed to get donation list");

            Err(Error::internal())
        }
    }
}
