use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries::{self, blood_bag::BloodBag};

use crate::{
    error::{Error, Result},
    state::ApiState,
};

#[utoipa::path(
    get,
    tag = "Blood Bag",
    path = "/blood-bag",
    operation_id = "blood_bag::get_all",
    security(("jwt_token" = []))
)]
pub async fn get_all(state: State<Arc<ApiState>>) -> Result<Json<Vec<BloodBag>>> {
    let database = state.database().await?;

    match queries::blood_bag::get_all().bind(&database).all().await {
        Ok(blood_bags) => Ok(Json(blood_bags)),
        Err(error) => {
            tracing::error!(?error, "Failed to get blog list");

            Err(Error::internal())
        }
    }
}
