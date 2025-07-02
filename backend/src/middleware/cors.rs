use axum::http::{
    HeaderName, HeaderValue, Method,
    header::{
        ACCEPT, ACCESS_CONTROL_ALLOW_HEADERS, ACCESS_CONTROL_ALLOW_METHODS,
        ACCESS_CONTROL_ALLOW_ORIGIN, AUTHORIZATION, CONTENT_TYPE, ORIGIN,
    },
};
use tower_http::cors::CorsLayer;

use crate::config::CONFIG;

const ALLOW_HEADERS: [HeaderName; 7] = [
    ORIGIN,
    AUTHORIZATION,
    ACCESS_CONTROL_ALLOW_ORIGIN,
    CONTENT_TYPE,
    ACCEPT,
    ACCESS_CONTROL_ALLOW_METHODS,
    ACCESS_CONTROL_ALLOW_HEADERS,
];
const ALLOW_METHODS: [Method; 5] = [
    Method::GET,
    Method::POST,
    Method::DELETE,
    Method::PATCH,
    Method::PUT,
];

const DEVELOPMENT_ORIGIN: &str = "http://localhost:3000";

pub fn cors() -> CorsLayer {
    let allow_origins = [&CONFIG.frontend_url, DEVELOPMENT_ORIGIN]
        .map(|origin| origin.parse::<HeaderValue>().unwrap());

    CorsLayer::new()
        .allow_origin(allow_origins)
        .allow_headers(ALLOW_HEADERS)
        .expose_headers(ALLOW_HEADERS)
        .allow_credentials(true)
        .allow_methods(ALLOW_METHODS)
}
