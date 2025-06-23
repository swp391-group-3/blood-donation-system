use std::{collections::HashMap, sync::Arc};

use axum::http::StatusCode;
use database::{
    deadpool_postgres::{self, Object},
    tokio_postgres::NoTls,
};
use futures::{StreamExt, stream};
use lettre::{AsyncSmtpTransport, Tokio1Executor, transport::smtp::authentication::Credentials};

use crate::{
    config::{CONFIG, oidc::Provider},
    error::{Error, Result},
    util::{jwt::JwtService, oidc::OpenIdConnectClient},
};

pub struct ApiState {
    pub database_pool: deadpool_postgres::Pool,
    pub oidc_clients: HashMap<Provider, OpenIdConnectClient>,
    pub jwt_service: JwtService,
    pub mailer: AsyncSmtpTransport<Tokio1Executor>,
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
                    OpenIdConnectClient::from_config(config.clone())
                        .await
                        .unwrap(),
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
        })
    }

    pub async fn database(&self) -> Result<Object> {
        match self.database_pool.get().await {
            Ok(database) => Ok(database),
            Err(error) => {
                tracing::error!(error =? error);

                Err(Error::builder()
                    .status(StatusCode::INTERNAL_SERVER_ERROR)
                    .build())
            }
        }
    }
}
