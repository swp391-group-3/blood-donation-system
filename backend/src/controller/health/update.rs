use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
};
use database::{
    client::Params,
    queries::{self, health::UpdateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState};

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
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<()> {
    let database = state.database_pool.get().await?;

    queries::health::update()
        .params(&database, &request.with_id(id))
        .await?;

    Ok(())
}
