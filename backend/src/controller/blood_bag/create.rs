use std::sync::Arc;

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use axum_valid::Valid;
use chrono::{DateTime, Utc};
use ctypes::{BloodComponent, Role};
use database::{
    client::Params,
    queries::{self, blood_bag::CreateParams},
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
#[schema(as = blood_bag::create::Request)]
#[mapper(
    into(custom = "with_donation_id"),
    ty = CreateParams,
    add(field = donation_id, ty = Uuid)
)]
pub struct Request {
    pub component: BloodComponent,
    pub amount: i32,
    pub expired_time: DateTime<Utc>,
}

#[utoipa::path(
    post,
    tags = ["Blood Bag", "Donation"],
    path = "/donation/{id}/blood-bag",
    operation_id = "blood-bag::create",
    request_body = Request,
    params(
        ("id" = Uuid, Path, description = "Donation id")
    ),
    responses(
        (status = Status::OK, body = Uuid)
    ),
    security(("jwt_token" = []))
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(donation_id): Path<Uuid>,
    Valid(Json(request)): Valid<Json<Request>>,
) -> Result<Json<Uuid>> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    match queries::blood_bag::create()
        .params(&database, &request.with_donation_id(donation_id))
        .one()
        .await
    {
        Ok(id) => Ok(Json(id)),
        Err(error) => {
            tracing::error!(?error, "Failed to create blood bag");
            Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid blood bag creation data".into())
                .build())
        }
    }
}
