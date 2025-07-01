use std::{collections::HashMap, sync::Arc};

use database::{
    deadpool_postgres::{self, Object},
    tokio_postgres::NoTls,
};
use futures::{StreamExt, stream};
use lettre::{AsyncSmtpTransport, Tokio1Executor, transport::smtp::authentication::Credentials};

use crate::{
    config::{CONFIG, oidc::Provider},
    error::{Error, Result},
    util::auth::{JwtService, OpenIdConnectClient},
};

#[cfg(feature = "rag")]
use crate::util::rag::RAGAgent;

pub struct ApiState {
    pub database_pool: deadpool_postgres::Pool,
    pub oidc_clients: HashMap<Provider, OpenIdConnectClient>,
    pub jwt_service: JwtService,
    pub mailer: AsyncSmtpTransport<Tokio1Executor>,
    #[cfg(feature = "rag")]
    pub rag_agent: RAGAgent,
}

impl ApiState {
    pub async fn new() -> Arc<Self> {
        let mut database_config = deadpool_postgres::Config::new();
        database_config.url = Some(CONFIG.database_url.clone());
        let database_pool = database_config
            .create_pool(Some(deadpool_postgres::Runtime::Tokio1), NoTls)
            .unwrap();

        let oidc_clients = stream::iter(CONFIG.oidc.iter())
            .then(|(&provider, config)| async move {
                (
                    provider,
                    OpenIdConnectClient::from_config(config.clone()).await,
                )
            })
            .collect()
            .await;

        let mailer = AsyncSmtpTransport::<Tokio1Executor>::relay("smtp.gmail.com")
            .unwrap()
            .credentials(Credentials::new(
                CONFIG.email.username.to_owned(),
                CONFIG.email.password.to_owned(),
            ))
            .build();

        Arc::new(Self {
            database_pool,
            oidc_clients,
            jwt_service: Default::default(),
            mailer,
            #[cfg(feature = "rag")]
            rag_agent: RAGAgent::new().await,
        })
    }

    pub async fn database(&self) -> Result<Object> {
        match self.database_pool.get().await {
            Ok(database) => Ok(database),
            Err(error) => {
                tracing::error!(?error, "Failed to get database connection");

                Err(Error::internal())
            }
        }
    }
}
