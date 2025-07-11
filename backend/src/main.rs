mod config;
mod controller;
#[cfg(feature = "cron-job")]
mod cron_job_scheduler;
mod doc;
mod error;
mod middleware;
mod state;
mod util;

use std::net::SocketAddr;

use axum::Router;
#[cfg(test)]
use axum_test::TestServer;
use state::ApiState;
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;

use crate::config::CONFIG;

async fn build_app() -> Router {
    let state = ApiState::new().await;

    let app = Router::new()
        .merge(controller::build())
        .merge(doc::build())
        .layer(TraceLayer::new_for_http())
        .layer(middleware::cors())
        .layer(middleware::session().await)
        .with_state(state);

    #[cfg(feature = "monitoring")]
    let app = app
        .layer(axum_tracing_opentelemetry::middleware::OtelAxumLayer::default())
        .layer(axum_tracing_opentelemetry::middleware::OtelInResponseLayer)
        .layer(middleware::prometheus().await);

    app
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    #[cfg(not(feature = "monitoring"))]
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .pretty()
        .with_timer(tracing_subscriber::fmt::time::ChronoLocal::rfc_3339())
        .init();

    #[cfg(feature = "monitoring")]
    let _guard =
        init_tracing_opentelemetry::tracing_subscriber_ext::init_subscribers_and_loglevel("DEBUG")
            .unwrap();

    #[cfg(feature = "cron-job")]
    cron_job_scheduler::build().await;

    let app = build_app().await;

    let listener = TcpListener::bind(SocketAddr::new([0, 0, 0, 0].into(), CONFIG.port)).await?;

    tracing::info!("Listening on port {}", CONFIG.port);

    axum::serve(listener, app)
        .await
        .map_err(anyhow::Error::from)
}

#[cfg(test)]
async fn build_test_server() -> TestServer {
    let app = build_app().await;

    TestServer::builder()
        .save_cookies()
        .expect_success_by_default()
        .mock_transport()
        .build(app)
        .unwrap()
}
