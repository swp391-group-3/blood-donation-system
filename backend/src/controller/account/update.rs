use std::sync::Arc;

use axum::{Json, extract::State};
use chrono::NaiveDate;
use ctypes::Gender;
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{error::Result, state::ApiState, util::jwt::Claims};
use database::{
    client::Params,
    queries::account::UpdateParams,
    queries::{self},
};

#[derive(Deserialize, ToSchema, Mapper)]
#[mapper(
    into(custom = "with_account_id"),
    ty = UpdateParams::<String, String, String>,
    add(field = id, ty = Uuid),
)]
pub struct Request {
    pub phone: Option<String>,
    pub name: Option<String>,
    pub gender: Option<Gender>,
    pub address: Option<String>,
    pub birthday: Option<NaiveDate>,
}

#[utoipa::path(
    put,
    tag = "Account",
    path = "/account",
    request_body = Request,
    responses(
        (status = Status::OK)
    ),
    security(("jwt_token" = []))
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Json(request): Json<Request>,
) -> Result<()> {
    let database = state.database_pool.get().await?;
    queries::account::update()
        .params(&database, &request.with_account_id(claims.sub))
        .await?;
    Ok(())
}
