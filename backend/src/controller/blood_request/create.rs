use std::sync::Arc;

use axum::{Json, extract::State};
use axum_valid::Valid;
use chrono::{DateTime, Utc};
use ctypes::{BloodGroup, RequestPriority};
use database::{
    client::Params,
    queries::{self, blood_request::CreateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{error::Result, state::ApiState, util::custom_validator, util::jwt::Claims};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = blood_request::create::Request)]
#[mapper(
    into(custom = "with_staff_id"),
    ty = CreateParams::<String>,
    add(field = staff_id, ty = Uuid),
)]
pub struct Request {
    #[mapper(skip)]
    pub blood_groups: Vec<BloodGroup>,
    pub priority: RequestPriority,
    #[validate(length(min = 1))]
    pub title: String,
    #[validate(range(min = 1))]
    pub max_people: i32,
    #[validate(custom(function = "custom_validator::date_time_must_after_now"))]
    pub start_time: DateTime<Utc>,
    #[validate(custom(function = "custom_validator::date_time_must_after_now"))]
    pub end_time: DateTime<Utc>,
}

#[utoipa::path(
    post,
    tag = "Blood Request",
    path = "/blood-request",
    operation_id = "blood_request::create",
    request_body = Request,
    responses(
        (status = Status::OK, body = Uuid)
    ),
    security(("jwt_token" = []))
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Valid(Json(request)): Valid<Json<Request>>,
) -> Result<Json<Uuid>> {
    let database = state.database_pool.get().await?;

    let blood_groups = request.blood_groups.clone();

    let id = queries::blood_request::create()
        .params(&database, &request.with_staff_id(claims.sub))
        .one()
        .await?;

    for blood_group in &blood_groups {
        queries::blood_request::add_blood_group()
            .bind(&database, &id, blood_group)
            .await?;
    }

    Ok(Json(id))
}
