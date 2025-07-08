mod blood_storage;

use database::{deadpool_postgres, tokio_postgres::NoTls};
use lettre::{AsyncSmtpTransport, Tokio1Executor, transport::smtp::authentication::Credentials};
use std::sync::Arc;
use tokio::time::sleep;

use crate::CONFIG;

pub async fn build() {
    let mut database_config = deadpool_postgres::Config::new();
    database_config.url = Some(CONFIG.database_url.clone());

    let database_pool = Arc::new(
        database_config
            .create_pool(Some(deadpool_postgres::Runtime::Tokio1), NoTls)
            .unwrap(),
    );

    let mailer: Arc<AsyncSmtpTransport<Tokio1Executor>> = Arc::new(
        AsyncSmtpTransport::<Tokio1Executor>::relay("smtp.gmail.com")
            .unwrap()
            .credentials(Credentials::new(
                CONFIG.email.username.to_owned(),
                CONFIG.email.password.to_owned(),
            ))
            .build(),
    );

    tokio::spawn(async move {
        loop {
            if let Err(error) = blood_storage::alert_low_stock(&database_pool, &mailer).await {
                tracing::error!(?error, "Failed to alert low blood stock")
            }

            sleep(CONFIG.schedule_time.alert_low_stock_delay).await;
        }
    });
}
