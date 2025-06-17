use std::{collections::HashSet, sync::Arc};

use axum::{Json, extract::State};
use ctypes::BloodGroup;
use database::queries;

use crate::{error::Result, state::ApiState, util::jwt::Claims};

use super::BloodRequest;

fn get_compatible(donor: BloodGroup) -> HashSet<BloodGroup> {
    use BloodGroup::*;
    match donor {
        OMinus => [OMinus, OPlus, AMinus, APlus, BMinus, BPlus, ABMinus, ABPlus]
            .into_iter()
            .collect(),
        OPlus => [OPlus, APlus, BPlus, ABPlus].into_iter().collect(),
        AMinus => [AMinus, APlus, ABMinus, ABPlus].into_iter().collect(),
        APlus => [APlus, ABPlus].into_iter().collect(),
        BMinus => [BMinus, BPlus, ABMinus, ABPlus].into_iter().collect(),
        BPlus => [BPlus, ABPlus].into_iter().collect(),
        ABMinus => [ABMinus, ABPlus].into_iter().collect(),
        ABPlus => [ABPlus].into_iter().collect(),
    }
}

#[utoipa::path(
    get,
    tag = "Blood Request",
    path = "/blood-request/recommended",
    operation_id = "blood_request::get_recommended"
)]
pub async fn get_recommended(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<BloodRequest>>> {
    let database = state.database_pool.get().await?;

    let account = queries::account::get()
        .bind(&database, &claims.sub)
        .one()
        .await?;

    let requests = queries::blood_request::get_all()
        .bind(&database)
        .map(BloodRequest::from_get_all)
        .all()
        .await?
        .into_iter()
        .filter(|request| {
            request.blood_groups.is_disjoint(&get_compatible(
                account.blood_group.expect("Member must have blood group"),
            ))
        })
        .collect();

    Ok(Json(requests))
}
