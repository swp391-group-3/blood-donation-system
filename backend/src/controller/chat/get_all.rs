use std::sync::Arc;

use axum::{Json, extract::State};
use rig::message::Message;
use tower_sessions::Session;

use crate::{error::Result, state::ApiState};

#[utoipa::path(
    get,
    tag = "Chat",
    path = "/chat",
    operation_id = "chat::get_all"
)]
pub async fn get_all(state: State<Arc<ApiState>>, session: Session) -> Result<Json<Vec<Message>>> {
    let histories = state.rag_agent.get_histories(&session).await?;

    Ok(Json(histories))
}
