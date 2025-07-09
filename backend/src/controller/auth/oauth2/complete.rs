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
use tower_sessions::Session;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::validation::{ValidJson, validate_past_naive_date, validate_phone},
};

use super::KEY;

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[schema(as = oauth2::complete::request)]
#[mapper(
    into(custom = "with_email"),
    ty = RegisterParams::<String, String, String, String, String>,
    add(field = email, ty = String),
    add(field = password, ty = Option::<String>, default)
)]
pub struct Request {
    #[validate(custom(function = validate_phone))]
    pub phone: String,
    #[validate(length(min = 1))]
    pub name: String,
    pub gender: Gender,
    #[validate(length(min = 1))]
    pub address: String,
    #[validate(custom(function = validate_past_naive_date))]
    pub birthday: NaiveDate,
    pub blood_group: BloodGroup,
}

#[utoipa::path(
    post,
    tag = "Auth",
    path = "/oauth2/complete",
    request_body = Request,
)]
pub async fn complete(
    state: State<Arc<ApiState>>,
    session: Session,
    jar: CookieJar,
    ValidJson(request): ValidJson<Request>,
) -> Result<CookieJar> {
    let database = state.database().await?;

    let email: String = match session.remove(KEY).await {
        Ok(Some(value)) => value,
        Ok(None) => {
            tracing::warn!("Failed to get stored session");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid call to oauth2 api".into())
                .build());
        }
        Err(error) => {
            tracing::error!(?error, "Session is not initialized");

            return Err(Error::internal());
        }
    };

    let id = match queries::account::register()
        .params(&database, &request.with_email(email))
        .one()
        .await
    {
        Ok(id) => id,
        Err(error) => {
            tracing::error!(?error, "Failed to register");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid login request".into())
                .build());
        }
    };

    let cookie = state.jwt_service.new_credential(id)?;

    Ok(jar.add(cookie))
}
