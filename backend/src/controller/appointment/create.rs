use std::{collections::HashSet, sync::Arc};

use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use ctypes::{AppointmentStatus,Role};
use database::{
    client::Params,
    queries::{self, appointment::CreateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    error::{Error, Result},
    state::ApiState,
    util::auth::{Claims, authorize},
};

#[derive(Deserialize, ToSchema, Mapper, Clone)]
#[mapper(
    into(custom = "with_appointment_id"),
    ty = queries::answer::CreateParams::<String>,
    add(field = appointment_id, ty = Uuid)
)]
pub struct Answer {
    pub question_id: i32,
    pub content: String,
}

#[derive(Deserialize, ToSchema)]
#[schema(as = blood_request::create_appointment::Request)]
pub struct Request {
    #[schema(inline)]
    pub answers: Vec<Answer>,
}

#[utoipa::path(
    post,
    tags = ["Appointment", "Blood Request"],
    path = "/blood-request/{id}/create-appointment",
    operation_id = "appointment::create",
    params(
        ("id" = Uuid, Path, description = "Blood request id")
    ),
    request_body = Request,
    responses(
        (status = Status::OK, body = Uuid)
    ),
    security(("jwt_token" = []))
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Path(id): Path<Uuid>,
    Json(request): Json<Request>,
) -> Result<Json<Uuid>> {
    let mut database = state.database().await?;

    authorize(&claims, [Role::Member], &database).await?;

    let question_ids: HashSet<_> = match queries::question::get_all()
        .bind(&database)
        .map(|raw| raw.id)
        .all()
        .await
    {
        Ok(ids) => ids.into_iter().collect(),
        Err(error) => {
            tracing::error!(?error, "Failed to fetch question list");

            return Err(Error::internal());
        }
    };

    let submitted_question_ids = request
        .answers
        .iter()
        .map(|answer| answer.question_id)
        .collect::<HashSet<_>>();

    if question_ids != submitted_question_ids {
        return Err(Error::builder()
            .status(StatusCode::BAD_REQUEST)
            .message("Please answer all question".into())
            .build());
    }

    let transaction = match database.transaction().await {
        Ok(transaction) => transaction,
        Err(error) => {
            tracing::error!(?error, "Failed to create transaction");

            return Err(Error::internal());
        }
    };

    let appointment_id = match queries::appointment::create()
        .params(
            &transaction,
            &CreateParams {
                request_id: id,
                member_id: claims.sub,
            },
        )
        .one()
        .await
    {
        Ok(id) => id,
        Err(error) => {
            tracing::error!(?error, "Failed to create appointment");

            return Err(Error::internal());
        }
    };

    if let Err(error) = queries::appointment::update_status()
        .bind(&transaction, &AppointmentStatus::OnProcess, &appointment_id)
        .await
    {
        tracing::error!(?error, id =? id, "Failed to on process appointment");

        return Err(Error::internal());
    }

    for answer in &request.answers {
        if let Err(error) = queries::answer::create()
            .params(
                &transaction,
                &answer.clone().with_appointment_id(appointment_id),
            )
            .await
        {
            tracing::error!(?error, "Failed to create answer");

            return Err(Error::builder()
                .status(StatusCode::BAD_REQUEST)
                .message(format!(
                    "Answer for question ${} is invalid",
                    answer.question_id
                ))
                .build());
        }
    }

    if let Err(error) = transaction.commit().await {
        tracing::error!(?error, "Failed to commit transaction");

        return Err(Error::internal());
    }

    Ok(Json(appointment_id))
}
