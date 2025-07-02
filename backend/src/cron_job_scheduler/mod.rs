mod blood_storage;

use std::sync::Arc;

use tokio_cron_scheduler::{Job, JobScheduler, JobSchedulerError};

use crate::state::ApiState;

pub async fn build(state: Arc<ApiState>) -> Result<JobScheduler, JobSchedulerError> {
    let sched = JobScheduler::new().await?;

    sched
        .add(Job::new_async("0 */5 * * * *", move |_uuid, _l| {
            let job_state = state.clone();
            Box::pin(async move {
                match blood_storage::alert_low_stock(job_state).await {
                    Err(error) => tracing::error!(?error, "Failed to alert low blood stock"),
                    _ => {}
                }
            })
        })?)
        .await?;

    sched.start().await?;
    Ok(sched)
}
