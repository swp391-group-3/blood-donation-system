use std::sync::Arc;

use axum::{
    extract::{Path, State},
    http::StatusCode,
};
use chrono::NaiveDate;
use ctypes::{Gender, Role};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::{
        auth::{Claims, authorize},
        validation::{ValidJson, validate_past_naive_date, validate_phone},
    },
};
use database::{
    client::Params,
    queries::account::UpdateParams,
    queries::{self},
};

#[derive(Deserialize, ToSchema, Mapper, Validate)]
#[mapper(
    into(custom = "with_account_id"),
    ty = UpdateParams::<String, String, String>,
    add(field = id, ty = Uuid),
)]
pub struct Request {
    #[validate(custom(function = validate_phone))]
    pub phone: Option<String>,
    #[validate(length(min = 1))]
    pub name: Option<String>,
    pub gender: Option<Gender>,
    #[validate(length(min = 1))]
    pub address: Option<String>,
    #[validate(custom(function = validate_past_naive_date))]
    pub birthday: Option<NaiveDate>,
}

#[utoipa::path(
    put,
    tag = "Account",
    path = "/account/{id}",
    params(
        ("id" = Uuid, Path, description = "The UUID of the account")
    ),
    request_body = Request,
    responses(
        (status = Status::OK)
    ),
    security(("jwt_token" = []))
)]
pub async fn update(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
    ValidJson(request): ValidJson<Request>,
) -> Result<()> {
    let database = state.database().await?;

    authorize(&claims, [Role::Admin], &database).await?;

    if let Err(error) = queries::account::update()
        .params(&database, &request.with_account_id(id))
        .await
    {
        tracing::info!(?error, "Failed to update account");

        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Failed to update account".into())
            .build());
    }

    Ok(())
}
