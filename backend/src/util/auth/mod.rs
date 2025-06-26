mod jwt;
mod oidc;

use axum::http::StatusCode;
pub use jwt::*;
pub use oidc::*;

use ctypes::Role;
use database::{deadpool_postgres::Object, queries};

use crate::error::{Error, Result};

pub async fn authorize<const N: usize>(
    claims: &Claims,
    required_roles: [Role; N],
    database: &Object,
) -> Result<()> {
    let account = match queries::account::get()
        .bind(database, &claims.sub)
        .opt()
        .await
    {
        Ok(Some(account)) => account,
        Ok(None) => {
            return Err(Error::builder()
                .status(StatusCode::UNAUTHORIZED)
                .message("Invalid token".into())
                .build());
        }
        Err(error) => {
            tracing::error!(?error, "Failed to fetch account");

            return Err(Error::internal());
        }
    };

    if !required_roles.contains(&account.role) {
        return Err(Error::builder()
            .status(StatusCode::FORBIDDEN)
            .message(format!("Require you to be one of {required_roles:?}"))
            .build());
    }

    Ok(())
}
