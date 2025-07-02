mod blood_storage;

use std::sync::Arc;

use tokio_cron_scheduler::{Job, JobScheduler, JobSchedulerError};

use crate::{CONFIG, state::ApiState};

pub async fn build(state: Arc<ApiState>) -> Result<(), JobSchedulerError> {
    let sched = JobScheduler::new().await?;

    sched
        .add(Job::new_async(
            &CONFIG.schedule_time.alert_low_stock_cron,
            move |_uuid, _l| {
                let job_state = state.clone();
                Box::pin(async move {
                    if let Err(error) = blood_storage::alert_low_stock(job_state).await {
                        tracing::error!(?error, "Failed to alert low blood stock")
                    }
                })
            },
        )?)
        .await?;

    sched.start().await?;
    Ok(())
}
