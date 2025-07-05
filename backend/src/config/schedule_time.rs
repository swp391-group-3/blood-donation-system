use std::time::Duration;

use serde::Deserialize;

const fn default_alert_low_stock_delay() -> Duration {
    // 1 hour
    Duration::from_secs(60 * 60)
}

#[derive(Debug, Deserialize)]
pub struct ScheduleTimeConfig {
    #[serde(default = "default_alert_low_stock_delay")]
    pub alert_low_stock_delay: Duration,
}

impl Default for ScheduleTimeConfig {
    fn default() -> Self {
        Self {
            alert_low_stock_delay: default_alert_low_stock_delay(),
        }
    }
}
