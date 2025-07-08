use std::sync::Arc;

use axum::{Json, extract::State};
use chrono::{DateTime, Utc};
use database::queries;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::Claims,
};

#[utoipa::path(
    get,
    tag = "Account",
    path = "/account/next-donatable-date",
    operation_id = "account::next_donatable_date",
    security(("jwt_token" = [])),
)]
pub async fn next_donatable_date(
    state: State<Arc<ApiState>>,
    claims: Claims,
) -> Result<Json<DateTime<Utc>>> {
    let database = state.database().await?;

    match queries::account::next_donatable_date()
        .bind(&database, &claims.sub)
        .one()
        .await
    {
        Ok(next_donatable_date) => {
            let next_donatable_date_utc = next_donatable_date.with_timezone(&Utc);

            Ok(Json(next_donatable_date_utc))
        }
        Err(error) => {
            tracing::error!(?error, "Failed to check next donatable date of account");

            Err(Error::internal())
        }
    }
}
