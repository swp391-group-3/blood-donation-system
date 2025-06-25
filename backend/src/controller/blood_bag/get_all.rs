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
        Ok(blood_bags) => {
            let mut filtered = blood_bags;

            if let Some(blood_group) = request.blood_group {
                let compatible = get_compatible_donors(blood_group);
                filtered = filtered
                    .into_iter()
                    .filter(|bb| compatible.contains(&bb.blood_group))
                    .collect();
            }

            if let Some(component) = request.component {
                filtered = filtered
                    .into_iter()
                    .filter(|bb| bb.component == component)
                    .collect();
            }

            Ok(Json(filtered))
        }
        Err(error) => {
            tracing::error!(?error, "Failed to get blog list");

            Err(Error::internal())
        }
    }
}
