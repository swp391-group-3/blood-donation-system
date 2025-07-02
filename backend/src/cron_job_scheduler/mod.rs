mod blood_storage;

use tokio_cron_scheduler::{Job, JobScheduler, JobSchedulerError};

pub async fn build() -> Result<JobScheduler, JobSchedulerError> {
    let sched = JobScheduler::new().await?;

    sched
        .add(Job::new("*/1 * * * * *", |_uuid, _l| {
            blood_storage::check_storage();
        })?)
        .await?;

    sched.start().await?;
    Ok(sched)
}
