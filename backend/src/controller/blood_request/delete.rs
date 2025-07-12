use std::sync::Arc;

use axum::extract::{Path, State};
use ctypes::Role;
use database::{
    client::Params,
    queries::{self, blood_request::DeleteParams},
};
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[utoipa::path(
    delete,
    tag = "Blood Request",
    path = "/blood-request/{id}",
    operation_id = "blood_request::delete",
    params(
        ("id" = Uuid, Path, description = "Blood request id")
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

    if let Err(error) = queries::blood_request::delete()
        .params(
            &database,
            &DeleteParams {
                id,
                staff_id: claims.sub,
            },
        )
        .await
    {
        tracing::error!(?error, "Failed to delete blood request");

        return Err(Error::internal());
    }

    Ok(())
}
