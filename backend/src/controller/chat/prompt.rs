use std::sync::Arc;

use axum::{body::Body, extract::State};
use tower_sessions::Session;

use crate::{error::Result, state::ApiState};

#[utoipa::path(
    post,
    tag = "Chat",
    path = "/chat",
    operation_id = "chat::prompt",
    request_body = String,
    responses(
        (status = Status::OK, content_type = "application/octet-stream", body = String)
    ),
)]
pub async fn prompt(state: State<Arc<ApiState>>, session: Session, prompt: String) -> Result<Body> {
    state.rag_agent.chat(prompt, Arc::new(session)).await
}
