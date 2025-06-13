use std::sync::Arc;

use axum::{Json, extract::State};
use axum_valid::Valid;
use database::{
    client::Params,
    queries::{self, account::CreateStaffParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    error::{AuthError, Result},
    state::ApiState,
};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = staff::create::Request)]
#[mapper(
    into,
    ty = CreateStaffParams::<String, String, String, String>,
)]
pub struct Request {
    #[validate(email)]
    pub email: String,
    pub password: String,
    #[validate(length(min = 10))]
    pub phone: String,
    #[validate(length(min = 1))]
    pub name: String,
}

#[utoipa::path(
    post,
    tag = "Account",
    path = "/account/create-staff",
    operation_id = "account::create_staff",
    request_body = Request,
    security(("jwt_token" = []))
)]
pub async fn create_staff(
    state: State<Arc<ApiState>>,
    Valid(Json(mut request)): Valid<Json<Request>>,
) -> Result<()> {
    let database = state.database_pool.get().await?;

    let password = state
        .bcrypt_service
        .hash(&request.password)
        .map_err(|error| {
            tracing::error!(error =? error);
            AuthError::InvalidLoginData
        })?
        .to_string();
    request.password = password;

    queries::account::create_staff()
        .params(&database, &request.into())
        .one()
        .await?;

    Ok(())
}
