use std::net::SocketAddr;

use axum::{Router, routing};
use axum_prometheus::PrometheusMetricLayer;
use tokio::net::TcpListener;

use crate::config::CONFIG;

pub async fn prometheus<'a>() -> PrometheusMetricLayer<'a> {
    let (prometheus_layer, metric_handle) = PrometheusMetricLayer::pair();

    let app = Router::<()>::new().route(
        "/metrics",
        routing::get(|| async move { metric_handle.render() }),
    );

    let listener = TcpListener::bind(SocketAddr::new([0, 0, 0, 0].into(), CONFIG.prometheus_port))
        .await
        .unwrap();

    tracing::info!(
        "Prometheus server is listening on port {}",
        CONFIG.prometheus_port
    );

    tokio::spawn(async move {
        if let Err(error) = axum::serve(listener, app).await {
            tracing::error!(?error, "Promethus server crashed");
        }
    });

    prometheus_layer
}
