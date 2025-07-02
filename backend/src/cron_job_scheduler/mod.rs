mod blood_storage;

use database::{deadpool_postgres, tokio_postgres::NoTls};

use lettre::{AsyncSmtpTransport, Tokio1Executor, transport::smtp::authentication::Credentials};

use tokio_cron_scheduler::{Job, JobScheduler, JobSchedulerError};

use std::sync::Arc;

use crate::CONFIG;

pub async fn build() -> Result<(), JobSchedulerError> {
    let sched = JobScheduler::new().await?;

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

    sched
        .add(Job::new_async(
            &CONFIG.schedule_time.alert_low_stock_cron,
            move |_uuid, _l| {
                let job_database_pool = Arc::clone(&database_pool);
                let job_mailer = Arc::clone(&mailer);
                Box::pin(async move {
                    if let Err(error) =
                        blood_storage::alert_low_stock(job_database_pool, job_mailer).await
                    {
                        tracing::error!(?error, "Failed to alert low blood stock")
                    }
                })
            },
        )?)
        .await?;

    sched.start().await?;
    Ok(())
}
