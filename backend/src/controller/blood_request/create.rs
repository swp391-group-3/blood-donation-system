use std::sync::Arc;

use crate::{controller::account::Account, util::blood_compatible::get_compatible};
use axum::{Json, extract::State};
use axum_valid::Valid;
use chrono::{DateTime, Utc};
use ctypes::{BloodGroup, RequestPriority, Role};
use database::{
    client::Params,
    queries::{self, blood_request::CreateParams},
};
use model_mapper::Mapper;
use serde::Deserialize;
use std::collections::HashSet;
use utoipa::ToSchema;
use uuid::Uuid;
use validator::Validate;

use crate::{
    error::Result, state::ApiState, util::custom_validator, util::jwt::Claims,
    util::notification::send,
};

#[derive(Deserialize, ToSchema, Mapper, Validate, Clone)]
#[schema(as = blood_request::create::Request)]
#[mapper(
    into(custom = "with_staff_id"),
    ty = CreateParams::<String>,
    add(field = staff_id, ty = Uuid),
)]
pub struct Request {
    #[mapper(skip)]
    pub blood_groups: Vec<BloodGroup>,
    pub priority: RequestPriority,
    #[validate(length(min = 1))]
    pub title: String,
    #[validate(range(min = 1))]
    pub max_people: i32,
    #[validate(custom(function = "custom_validator::date_time_must_after_now"))]
    pub start_time: DateTime<Utc>,
    #[validate(custom(function = "custom_validator::date_time_must_after_now"))]
    pub end_time: DateTime<Utc>,
}

#[utoipa::path(
    post,
    tag = "Blood Request",
    path = "/blood-request",
    operation_id = "blood_request::create",
    request_body = Request,
    responses(
        (status = Status::OK, body = Uuid)
    ),
    security(("jwt_token" = []))
)]
pub async fn create(
    state: State<Arc<ApiState>>,
    claims: Claims,
    Valid(Json(request)): Valid<Json<Request>>,
) -> Result<Json<Uuid>> {
    let database = state.database_pool.get().await?;

    let request_clone = request.clone();

    let id = queries::blood_request::create()
        .params(&database, &request.with_staff_id(claims.sub))
        .one()
        .await?;

    let accounts = queries::account::get_by_role()
        .bind(&database, &Role::Member)
        .map(Account::from_get_by_role)
        .all()
        .await?;

    for blood_group in &request_clone.blood_groups {
        queries::blood_request::add_blood_group()
            .bind(&database, &id, blood_group)
            .await?;
    }

    if request_clone.priority == RequestPriority::High {
        let request_blood_groups: HashSet<_> = request_clone.blood_groups.iter().cloned().collect();

        for account in &accounts {
            if let Some(ref blood_group) = account.blood_group {
                if !request_blood_groups.is_disjoint(&get_compatible(*blood_group)) {
                    let subject =
                        "URGENT: Immediate Blood Donation Needed – Matches Your Blood Group"
                            .to_string();

                    let body = format!(
                        "Dear {},\n\n\
                We are reaching out to you with great urgency.\n\n\
                A critical situation has arisen, and we are in immediate need of blood donations. \
                Your registered blood group matches the current emergency requirement.\n\n\
                Request Details:\n\
                - Title: {}\n\
                - Maximum People Needed: {}\n\
                - Timeframe: From {} to {}\n\n\
                If you are able and available to donate, your support could help save a life.\n\n\
                Please contact the donation center or respond to this email as soon as possible.\n\n\
                Thank you for your prompt attention and compassion.\n\n\
                Sincerely,\n\
                Blood Donation Team",
                        account.name,
                        request_clone.title,
                        request_clone.max_people,
                        request_clone.start_time.format("%Y-%m-%d %H:%M"),
                        request_clone.end_time.format("%Y-%m-%d %H:%M"),
                    );

                    send(account, subject, body).await?;
                }
            }
        }
    }

    Ok(Json(id))
}
