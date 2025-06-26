use std::sync::Arc;

use axum::{
    Json,
    extract::{Query, State},
};
use ctypes::{BloodComponent, BloodGroup};
use database::queries::{self, blood_bag::BloodBag};
use serde::Deserialize;
use utoipa::ToSchema;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::blood::get_compatible_donors,
};

#[derive(Deserialize, ToSchema)]
#[schema(as = blood_bag::create::request)]
pub struct Request {
    pub blood_group: Option<BloodGroup>,
    pub component: Option<BloodComponent>,
}

#[utoipa::path(
    get,
    tag = "Blood Bag",
    path = "/blood-bag",
    operation_id = "blood_bag::get_all",
    params(
        ("blood_group" = Option<BloodGroup>, Query, description = "Filter by blood group"),
        ("component" = Option<BloodComponent>, Query, description = "Filter by blood component")
    ),
    security(("jwt_token" = []))
)]
pub async fn get_all(
    state: State<Arc<ApiState>>,
    Query(request): Query<Request>,
) -> Result<Json<Vec<BloodBag>>> {
    let database = state.database().await?;

    match queries::blood_bag::get_all().bind(&database).all().await {
        Ok(mut blood_bags) => {
            if let Some(blood_group) = request.blood_group {
                let compatible = get_compatible_donors(blood_group);
                blood_bags.retain(|bb| compatible.contains(&bb.blood_group));
            }

            if let Some(component) = request.component {
                blood_bags.retain(|bb| bb.component == component);
            }

            Ok(Json(blood_bags))
        }
        Err(error) => {
            tracing::error!(?error, "Failed to get blood bag list");

            Err(Error::internal())
        }
    }
}
