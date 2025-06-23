use std::{collections::HashSet, sync::Arc};

use axum::{Json, extract::State, http::StatusCode};
use database::queries::{self, blood_request::BloodRequest};
use futures::TryStreamExt;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::Claims,
};

use crate::util::blood::get_compatible;

#[utoipa::path(
    get,
    tag = "Blood Request",
    path = "/blood-request",
    operation_id = "blood_request::get_all"
)]
pub async fn get_all(
    state: State<Arc<ApiState>>,
    claims: Option<Claims>,
) -> Result<Json<Vec<BloodRequest>>> {
    let database = state.database().await?;

    let requests = match queries::blood_request::get_all()
        .bind(&database)
        .all()
        .await
    {
        Ok(requests) => requests,
        Err(error) => {
            tracing::error!(?error, "Failed to get request list");

            return Err(Error::internal());
        }
    };

    let Some(claims) = claims else {
        return Ok(Json(requests));
    };

    let account = match queries::account::get()
        .bind(&database, &claims.sub)
        .one()
        .await
    {
        Ok(account) => account,
        Err(error) => {
            tracing::error!(?error, "Invalid claims");

            return Err(Error::builder().status(StatusCode::UNAUTHORIZED).build());
        }
    };

    let compatible_blood_groups = match account.blood_group {
        Some(blood_group) => get_compatible(blood_group),
        None => return Ok(Json(requests)),
    };

    let mut filtered_requests = Vec::new();

    for request in requests {
        let blood_groups = match queries::blood_request::get_blood_group()
            .bind(&database, &request.id)
            .iter()
            .await
        {
            Ok(blood_groups) => blood_groups,
            Err(error) => {
                tracing::error!(
                    ?error,
                    request_id =? request.id,
                    "Failed to get blood group of request"
                );

                return Err(Error::internal());
            }
        };

        let blood_groups: HashSet<_> = match blood_groups.try_collect().await {
            Ok(blood_groups) => blood_groups,
            Err(error) => {
                tracing::error!(
                    ?error,
                    request_id =? request.id,
                    "Failed to get blood group of request"
                );

                return Err(Error::internal());
            }
        };

        if !blood_groups.is_disjoint(&compatible_blood_groups) {
            filtered_requests.push(request);
        }
    }

    Ok(Json(filtered_requests))
}
