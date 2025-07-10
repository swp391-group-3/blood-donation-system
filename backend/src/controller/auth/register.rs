use std::sync::Arc;

use axum::{extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use chrono::NaiveDate;
use ctypes::{BloodGroup, Gender};
use database::{
    client::Params,
    queries::{self, account::RegisterParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    config::CONFIG,
    error::{Error, Result},
    state::ApiState,
    util::validation::{ValidJson, validate_birthday, validate_phone},
};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = auth::register::request)]
#[mapper(into, ty = RegisterParams::<String, String, String, String, String>)]
pub struct Request {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 8))]
    pub password: String,
    #[validate(custom(function = validate_phone))]
    pub phone: String,
    #[validate(length(min = 1))]
    pub name: String,
    pub gender: Gender,
    #[validate(length(min = 1))]
    pub address: String,
    #[validate(custom(function = validate_birthday))]
    pub birthday: NaiveDate,
    pub blood_group: BloodGroup,
}

#[utoipa::path(
    post,
    tag = "Auth",
    path = "/auth/register",
    request_body = Request,
)]
pub async fn register(
    state: State<Arc<ApiState>>,
    jar: CookieJar,
    ValidJson(mut request): ValidJson<Request>,
) -> Result<CookieJar> {
    let database = state.database().await?;

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

    let id = match queries::account::register()
        .params(&database, &request.into())
        .one()
        .await
    {
        Ok(id) => id,
        Err(error) => {
            tracing::error!(?error, "Failed to create account");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid register data".into())
                .build());
        }
    };

    let cookie = state.jwt_service.new_credential(id)?;

    Ok(jar.add(cookie))
}
