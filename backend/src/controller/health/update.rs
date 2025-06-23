use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use ctypes::Role;
use database::{
    client::Params,
    queries::{self, health::UpdateParams},
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
#[schema(as = health::update::Request)]
#[mapper(
    into(custom = "with_id"),
    ty = UpdateParams::<String>,
    add(field = id, ty = Uuid)
)]
pub struct Request {
    pub temperature: Option<f32>,
    pub weight: Option<f32>,
    pub upper_blood_pressure: Option<i32>,
    pub lower_blood_pressure: Option<i32>,
    pub heart_rate: Option<i32>,
    pub is_good_health: Option<bool>,
    pub note: Option<String>,
}

#[utoipa::path(
    patch,
    tag = "Health",
    path = "/health",
    operation_id = "health::update",
    params(
        ("id" = Uuid, Path, description = "Health id")
    ),
    request_body = Request,
    security(("jwt_token" = []))
) ]
pub async fn update(
    State(state): State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<()> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    if let Err(error) = queries::health::update()
        .params(&database, &request.with_id(id))
        .await
    {
        tracing::error!(?error, "Failed to upadte health");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Invalid health data".into())
            .build());
    }

    Ok(())
}
