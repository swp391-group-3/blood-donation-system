mod create_staff;
mod delete;
mod get;
mod get_all;
mod update;

use std::sync::Arc;

use axum::{Router, routing};
use chrono::{DateTime, NaiveDate, Utc};
use ctypes::{BloodGroup, Gender, Role};
use database::queries::account::{GetAllBorrowed, GetBorrowed, GetByRoleBorrowed};
use model_mapper::Mapper;
use serde::Serialize;
use utoipa::ToSchema;

use crate::{middleware, state::ApiState};

pub use create_staff::*;
pub use delete::*;
pub use get::*;
pub use get_all::*;
pub use update::*;

#[derive(Serialize, ToSchema, Mapper)]
#[mapper(derive(from(custom = "from_get_all"), ty = GetAllBorrowed::<'_>))]
#[mapper(derive(from(custom = "from_get"), ty = GetBorrowed::<'_>))]
#[mapper(derive(from(custom = "from_get_by_role"), ty = GetByRoleBorrowed::<'_>))]
pub struct Account {
    pub role: Role,
    pub email: String,
    pub phone: String,
    pub name: String,
    pub gender: Option<Gender>,
    #[mapper(with = address.map(|x| x.to_string()))]
    pub address: Option<String>,
    pub birthday: Option<NaiveDate>,
    pub blood_group: Option<BloodGroup>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
}

pub fn build(state: Arc<ApiState>) -> Router<Arc<ApiState>> {
    let admin_router = Router::new()
        .route("/account/create-staff", routing::post(create_staff))
        .route("/account", routing::get(get_all))
        .route("/account/{id}", routing::delete(delete))
        .route("/account", routing::put(update))
        .layer(axum::middleware::from_fn_with_state(
            state.clone(),
            middleware::authorize!(Role::Admin),
        ));

    let admin_staff_router = Router::new()
        .route("/account/{id}", routing::get(get))
        .layer(axum::middleware::from_fn_with_state(
            state,
            middleware::authorize!(Role::Admin, Role::Staff),
        ));

    Router::new().merge(admin_router).merge(admin_staff_router)
}
