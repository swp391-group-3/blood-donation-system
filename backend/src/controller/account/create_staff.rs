use std::sync::Arc;

use axum::{extract::State, http::StatusCode};
use ctypes::Role;
use database::{
    client::Params,
    queries::{self, account::CreateStaffParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    config::CONFIG,
    error::{Error, Result},
    state::ApiState,
    util::{
        auth::{Claims, authorize},
        validation::ValidJson,
    },
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
    #[validate(length(min = 8))]
    pub password: String,
    #[validate(length(equal = 10))]
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
    claims: Claims,
    ValidJson(mut request): ValidJson<Request>,
) -> Result<()> {
    let database = state.database().await?;

    authorize(&claims, [Role::Admin], &database).await?;

    request.password =
        match bcrypt::hash_with_salt(&request.password, CONFIG.bcrypt.cost, CONFIG.bcrypt.salt) {
            Ok(hashed_password) => hashed_password.to_string(),
            Err(error) => {
                tracing::error!(?error, "Failed to hash password");

                return Err(Error::builder()
                    .status(StatusCode::BAD_REQUEST)
                    .message("Invalid password".into())
                    .build());
            }
        };

    if let Err(error) = queries::account::create_staff()
        .params(&database, &request.into())
        .one()
        .await
    {
        tracing::error!(?error, "Failed to create staff account");

        return Err(Error::internal());
    }

    Ok(())
}
