use std::sync::Arc;

use axum::Router;
use utoipa::{
    Modify, OpenApi,
    openapi::security::{ApiKey, ApiKeyValue, SecurityScheme},
};
use utoipa_swagger_ui::SwaggerUi;

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
#[openapi(
    paths(
        controller::ping,

        controller::auth::register,
        controller::auth::login,
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

        controller::blood_request::create,
        controller::blood_request::get,
        controller::blood_request::get_all,
        controller::blood_request::get_by_member_id,
        controller::blood_request::update,
        controller::blood_request::delete,

        controller::appointment::create,
        controller::appointment::get_answer,
        controller::appointment::get,
        controller::appointment::get_by_member_id,
        controller::appointment::update_status,
        controller::appointment::approve,
        controller::appointment::reject,

        controller::blog::create,
        controller::blog::get,
        controller::blog::get_all,
        controller::blog::update,
        controller::blog::delete,

        controller::health::create,
        controller::health::update,
        controller::health::get_by_appointment_id,
        controller::health::get_by_member_id,

        controller::donation::create,
        controller::donation::get,
        controller::donation::get_all,
        controller::donation::get_by_member_id,
        controller::donation::get_by_appointment_id,
        controller::donation::update,

        controller::comment::create,
        controller::comment::delete,
        controller::comment::update,

        controller::blood_bag::create,
        controller::blood_bag::get_all,
        controller::blood_bag::get,
        controller::blood_bag::delete,
        controller::blood_bag::update,

    ),
    modifiers(&SecurityAddon),
)]
struct ApiDoc;

pub fn build() -> Router<Arc<ApiState>> {
    SwaggerUi::new("/swagger-ui")
        .url("/api-docs/openapi.json", ApiDoc::openapi())
        .into()
}
