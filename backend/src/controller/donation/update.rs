use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use database::{
    client::Params,
    queries::{self, donation::UpdateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
};

#[derive(Deserialize, ToSchema, Mapper)]
#[schema(as = donation::update::Request)]
#[mapper(
    into(custom = "with_id"),
    ty = UpdateParams,
    add(field = id, ty = Uuid)
)]
pub struct Request {
    pub r#type: Option<ctypes::DonationType>,
    pub amount: Option<i32>,
}

#[utoipa::path(
    patch,
    tag = "Donation",
    path = "/donation/{id}",
    operation_id = "donation::update",
    params(
        ("id" = Uuid, Path, description = "Donation id")
    ),
    request_body = Request,
    security(("jwt_token" = []))
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<()> {
    let database = state.database().await?;

    if let Err(error) = queries::donation::update()
        .params(&database, &request.with_id(id))
        .await
    {
        tracing::error!(?error, "Failed to update donation");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Invalid donation data".into())
            .build());
    }

    Ok(())
}
