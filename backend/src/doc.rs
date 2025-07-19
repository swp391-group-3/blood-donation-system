use std::sync::Arc;

use axum::Router;
use utoipa::{
    Modify, OpenApi,
    openapi::security::{ApiKey, ApiKeyValue, SecurityScheme},
};
use utoipa_swagger_ui::SwaggerUi;

use crate::error::ErrorResponse;

use super::{controller, state::ApiState};

struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        if let Some(components) = openapi.components.as_mut() {
            components.add_security_scheme(
                "jwt_token",
                SecurityScheme::ApiKey(ApiKey::Cookie(ApiKeyValue::new("token"))),
            )
        }
    }
}

#[derive(OpenApi)]
#[cfg_attr(
    feature = "rag",
    openapi(paths(controller::chat::prompt, controller::chat::get_all,))
)]
struct ChatDoc;

#[derive(OpenApi)]
#[openapi(
    paths(
        controller::ping,

        controller::auth::register,
        controller::auth::login,
        controller::auth::logout,
        controller::auth::oauth2::oauth2,
        controller::auth::oauth2::complete,
        controller::auth::me,

        controller::question::create,
        controller::question::get_all,
        controller::question::update,
        controller::question::delete,

        controller::account::create_staff,
        controller::account::get_all,
        controller::account::get,
        controller::account::delete,
        controller::account::update,
        controller::account::next_donatable_date,
        controller::account::is_applied,
        controller::account::me,

        controller::blood_request::create,
        controller::blood_request::get,
        controller::blood_request::get_all,
        controller::blood_request::update,
        controller::blood_request::delete,
        controller::blood_request::stats,

        controller::appointment::create,
        controller::appointment::get,
        controller::appointment::get_answer,
        controller::appointment::get_all,
        controller::appointment::get_by_donor_id,
        controller::appointment::approve,
        controller::appointment::reject,
        controller::appointment::done,
        controller::appointment::stats,

        controller::blog::create,
        controller::blog::get,
        controller::blog::get_all,
        controller::blog::update,
        controller::blog::delete,

        controller::health::create,
        controller::health::update,
        controller::health::get_by_appointment_id,
        controller::health::get_by_donor_id,

        controller::donation::create,
        controller::donation::get,
        controller::donation::get_all,
        controller::donation::get_by_donor_id,
        controller::donation::get_by_appointment_id,
        controller::donation::update,

        controller::comment::create,
        controller::comment::get_by_blog_id,
        controller::comment::delete,
        controller::comment::update,

        controller::blood_bag::create,
        controller::blood_bag::get_all,
        controller::blood_bag::get,
        controller::blood_bag::delete,
        controller::blood_bag::update,
        controller::blood_bag::stats,

        controller::dashboard::stats,
        controller::dashboard::donation_trends,
        controller::dashboard::request_trends,
        controller::dashboard::blood_group_distribution,
    ),
    components(schemas(
        ErrorResponse,
    )),
    modifiers(&SecurityAddon),
)]
struct ApiDoc;

pub fn build() -> Router<Arc<ApiState>> {
    SwaggerUi::new("/swagger-ui")
        .url(
            "/api-docs/openapi.json",
            ApiDoc::openapi().merge_from(ChatDoc::openapi()),
        )
        .into()
}
