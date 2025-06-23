use std::sync::Arc;

use axum::{Json, extract::State};
use database::queries;
use futures::{StreamExt, TryStreamExt};

use crate::{error::Result, state::ApiState, util::jwt::Claims};

use super::Appointment;

#[utoipa::path(
    get,
    tag = "Appointment",
    path = "/appointment",
    operation_id = "appointment::get_by_member_id",
    responses(
        (status = Status::OK, body = Appointment)
    ),
    security(("jwt_token" = []))
)]
pub async fn get_by_member_id(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<Vec<Appointment>>> {
    let database = state.database_pool.get().await?;

    let appointments = queries::appointment::get_by_member_id()
        .bind(&database, &claims.sub)
        .iter()
        .await?
        .then(|raw| {
            let state = state.clone();

            async move {
                let raw = raw?;

                let database = state.database_pool.get().await?;

                Appointment::new(raw.id, raw.member_id, raw.request_id, raw.status, &database).await
            }
        })
        .try_collect()
        .await?;

    Ok(Json(appointments))
}
