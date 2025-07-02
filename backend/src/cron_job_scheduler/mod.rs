mod blood_storage;

use tokio_cron_scheduler::{Job, JobScheduler, JobSchedulerError};

pub async fn build() -> Result<JobScheduler, JobSchedulerError> {
    let sched = JobScheduler::new().await?;

    sched
        .add(Job::new_async("*/1 * * * * *", |_uuid, _l| {
            Box::pin(async {
                match blood_storage::check_storage().await {
                    Err(error) => tracing::error!(?error, "Failed to check blood storage"),
                    _ => {}
                }
            })
        })?)
        .await?;

    sched.start().await?;
    Ok(sched)
}
