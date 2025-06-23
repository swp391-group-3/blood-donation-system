use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use chrono::{DateTime, FixedOffset, Utc};
use ctypes::{BloodComponent, Role};
use database::{
    client::Params,
    queries::{self, blood_bag::UpdateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[derive(Deserialize, ToSchema, Mapper)]
#[schema(as = blood_bag::update::Request)]
#[mapper(into(custom = "with_donation_id"), ty = UpdateParams, add(field = id, ty = Uuid))]
pub struct Request {
    pub component: Option<BloodComponent>,
    pub amount: Option<i32>,
    #[mapper(with = expired_time.map(|dt| dt.with_timezone(&FixedOffset::east_opt(0).unwrap())))]
    pub expired_time: Option<DateTime<Utc>>,
}

#[utoipa::path(
    patch,
    tag = "Blood Bag",
    path = "/blood-bag/{id}",
    operation_id = "blood_bag::update",
    request_body = Request,
    params(
        ("id" = Uuid, Path, description = "Blood bag id")
    ),
    security(("jwt_token" = []))
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<()> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    if let Err(error) = queries::blood_bag::update()
        .params(&database, &request.with_donation_id(id))
        .await
    {
        tracing::error!(?error, "Failed to update blood bag");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Invalid new blood bag data".into())
            .build());
    }

    Ok(())
}
