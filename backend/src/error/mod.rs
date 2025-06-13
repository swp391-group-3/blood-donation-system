mod auth;

pub use auth::*;

use axum::{Json, http::StatusCode, response::IntoResponse};
use axum_extra::typed_header::TypedHeaderRejection;
use database::{deadpool_postgres::PoolError, tokio_postgres};
use serde::Serialize;
use utoipa::ToSchema;
use validator::ValidationErrors;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Serialize, ToSchema)]
pub struct ErrorResponse {
    pub message: String,
}

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("Database pool error: {0}")]
    DatabasePool(#[from] PoolError),

    #[error("Database error: {0}")]
    Database(#[from] tokio_postgres::Error),

    #[error("{0}")]
    Auth(#[from] AuthError),

    #[error("{0}")]
    Validation(#[from] ValidationErrors),

    #[error("Unknown error: {0}")]
    Other(#[from] anyhow::Error),
}

impl From<TypedHeaderRejection> for Error {
    fn from(_: TypedHeaderRejection) -> Self {
        AuthError::MissingAuthToken.into()
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        match self {
            Error::DatabasePool(_) | Error::Database(_) => (
                StatusCode::BAD_REQUEST,
                Json(ErrorResponse {
                    message: "Failed to execute query".to_string(),
                }),
            )
                .into_response(),
            Error::Auth(error) => error.into_response(),
            Error::Other(error) => (
                StatusCode::BAD_REQUEST,
                Json(ErrorResponse {
                    message: error.to_string(),
                }),
            )
                .into_response(),
            Error::Validation(error) => (
                StatusCode::BAD_REQUEST,
                Json(ErrorResponse {
                    message: error.to_string(),
                }),
            )
                .into_response(),
        }
    }
}
