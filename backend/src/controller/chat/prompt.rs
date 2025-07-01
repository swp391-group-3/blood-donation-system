use std::sync::Arc;

use axum::extract::State;
use tower_sessions::Session;

use crate::{error::Result, state::ApiState};

#[utoipa::path(
    post,
    tag = "Chat",
    path = "/chat",
    operation_id = "chat::prompt",
    request_body = String,
    responses(
        (status = Status::OK, body = String)
    ),
)]
pub async fn prompt(
    state: State<Arc<ApiState>>,
    session: Session,
    prompt: String,
) -> Result<String> {
    let response = state.rag_agent.chat(prompt, &session).await?;

    Ok(response)
}
