use futures::StreamExt;
use qdrant_client::{
    Qdrant,
    qdrant::{CreateCollectionBuilder, Distance, QueryPointsBuilder, VectorParamsBuilder},
};
use rig::{
    Embed, agent::Agent, completion::Chat, embeddings::EmbeddingsBuilder, message::Message,
    providers::gemini,
};
use rig_qdrant::QdrantVectorStore;
use serde::Serialize;
use tokio::fs;
use tokio_stream::wrappers::ReadDirStream;
use tower_sessions::Session;

use crate::{config::CONFIG, error::Error};

const GEMINI_EMBEDING_SIZE: u64 = 768;
const DOCUMENT_PATH: &str = "docs";
const HISTORY_KEY: &str = "history";

#[derive(Embed, Serialize, Clone, Debug, Eq, PartialEq, Default)]
pub struct Document {
    file_name: String,
    #[embed]
    content: String,
}

impl Document {
    async fn read_all() -> Vec<Document> {
        ReadDirStream::new(fs::read_dir(DOCUMENT_PATH).await.unwrap())
            .map(|raw| raw.unwrap().path())
            .then(|path| async move {
                Document {
                    file_name: path.file_name().unwrap().to_string_lossy().to_string(),
                    content: fs::read_to_string(path).await.unwrap(),
                }
            })
            .collect()
            .await
    }
}

pub struct RAGAgent {
    agent: Agent<gemini::completion::CompletionModel>,
}

impl RAGAgent {
    pub async fn new() -> Self {
        let client = gemini::Client::new(&CONFIG.rag.gemini_api_key);
        let embedding_model = client.embedding_model(gemini::embedding::EMBEDDING_004);

        let embeddings = EmbeddingsBuilder::new(embedding_model.clone())
            .documents(Document::read_all().await)
            .unwrap()
            .build()
            .await
            .unwrap();

        let qdrant = Qdrant::from_url(&CONFIG.rag.qdrant_url).build().unwrap();

        if !qdrant
            .collection_exists(&CONFIG.rag.collection_name)
            .await
            .unwrap()
        {
            qdrant
                .create_collection(
                    CreateCollectionBuilder::new(&CONFIG.rag.collection_name).vectors_config(
                        VectorParamsBuilder::new(GEMINI_EMBEDING_SIZE, Distance::Cosine),
                    ),
                )
                .await
                .unwrap();
        }

        let query_params = QueryPointsBuilder::new(&CONFIG.rag.collection_name).with_payload(true);
        let vector_store =
            QdrantVectorStore::new(qdrant, embedding_model.clone(), query_params.build());

        vector_store.insert_documents(embeddings).await.unwrap();

        let agent = client
            .agent(gemini::completion::GEMINI_2_0_FLASH)
            .preamble(&CONFIG.rag.system_prompt)
            .dynamic_context(CONFIG.rag.context_sample, vector_store)
            .build();

        Self { agent }
    }

    pub async fn get_histories(&self, session: &Session) -> Result<Vec<Message>, Error> {
        match session.get(HISTORY_KEY).await {
            Ok(Some(histories)) => Ok(histories),
            Ok(None) => {
                tracing::info!("New chat session created");
                Ok(vec![])
            }
            Err(error) => {
                tracing::error!(?error, "Failed to get chat session");
                Err(Error::internal())
            }
        }
    }

    async fn append_histories(
        &self,
        messages: &[Message],
        histories: &[Message],
        session: &Session,
    ) -> Result<(), Error> {
        let histories = [messages, histories].concat();

        match session.insert(HISTORY_KEY, histories).await {
            Ok(_) => Ok(()),
            Err(error) => {
                tracing::error!(?error, "Failed to save chat session");
                Err(Error::internal())
            }
        }
    }

    pub async fn chat(&self, prompt: String, session: &Session) -> Result<String, Error> {
        let histories = self.get_histories(session).await?;

        let response = match self.agent.chat(prompt.as_str(), histories.clone()).await {
            Ok(response) => response,
            Err(error) => {
                tracing::error!(?error, "Failed to chat with agent");
                return Err(Error::internal());
            }
        };

        self.append_histories(
            &[Message::user(prompt), Message::assistant(response.clone())],
            &histories,
            session,
        )
        .await?;

        Ok(response)
    }
}
