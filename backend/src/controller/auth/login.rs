use std::sync::Arc;

use axum::{extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use database::queries;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::validation::ValidJson,
};

#[derive(Deserialize, ToSchema, Validate)]
#[schema(as = auth::login::Request)]
pub struct Request {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 1))]
    pub password: String,
}

#[utoipa::path (
    post,
    tag = "Auth",
    path = "/auth/login",
    request_body = Request,
)]
pub async fn login(
    state: State<Arc<ApiState>>,
    jar: CookieJar,
    ValidJson(request): ValidJson<Request>,
) -> Result<CookieJar> {
    let database = state.database().await?;

    let account = match queries::account::get_by_email()
        .bind(&database, &request.email)
        .opt()
        .await
    {
        Ok(Some(account)) => account,
        Ok(None) => {
            tracing::warn!(
                email = request.email,
                "No account with given email or account is inactive"
            );

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid login credential".into())
                .build());
        }
        Err(error) => {
            tracing::warn!(?error, "Failed to fetch account");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid login credential".into())
                .build());
        }
    };

    match bcrypt::verify(&request.password, &account.password) {
        Ok(true) => {}
        Ok(false) => {
            tracing::warn!("Login failed");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message("Invalid login credential".into())
                .build());
        }
        Err(error) => {
            tracing::error!(?error, "Failed to verify password");

            return Err(Error::internal());
        }
    }

    let cookie = state.jwt_service.new_credential(account.id)?;

    Ok(jar.add(cookie))
}
