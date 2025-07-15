use std::sync::Arc;

use axum::extract::{Path, State};
use ctypes::Role;
use database::queries;
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    delete,
    tag = "Blood Bag",
    path = "/blood-bag/{id}",
    operation_id = "blood_bag::delete",
    params(
        ("id" = Uuid, Path, description = "Blood bag id")
    ),
    security(("jwt_token" = []))
)]
pub async fn delete(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
) -> Result<()> {
    let database = state.database().await?;

    authorize(&claims, [Role::Staff], &database).await?;

    if let Err(error) = queries::blood_bag::delete().bind(&database, &id).await {
        tracing::error!(?error, "Failed to delete blood bag");

        return Err(Error::internal());
    }

    Ok(())
}
