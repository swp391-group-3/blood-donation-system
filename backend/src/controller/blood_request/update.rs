use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use axum_valid::Valid;
use ctypes::{RequestPriority, Role};
use database::{
    client::Params,
    queries::{self, blood_request::UpdateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = blood_request::update::Request)]
#[mapper(
    into(custom = "with_id"),
    ty = UpdateParams::<String>,
    add(field = id, ty = Uuid)
)]
pub struct Request {
    pub priority: Option<RequestPriority>,
    #[validate(length(min = 1))]
    pub title: Option<String>,
    #[validate(range(min = 1))]
    pub max_people: Option<i32>,
}

#[utoipa::path(
    put,
    tag = "Blood Request",
    path = "/blood-request/{id}",
    operation_id = "blood_request::update",
    params(
        ("id" = Uuid, Path, description = "Blood request id")
    ),
    request_body = Request,
    security(("jwt_token" = []))
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
    Valid(Json(request)): Valid<Json<Request>>,
) -> Result<()> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    if let Err(error) = queries::blood_request::update()
        .params(&database, &request.with_id(id))
        .await
    {
        tracing::error!(?error, "Failed to update blood request");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Invalid blood request data".into())
            .build());
    }

    Ok(())
}
