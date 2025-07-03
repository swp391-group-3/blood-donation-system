use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct ScheduleTimeConfig {
    #[serde(default = "default_alert_low_stock_cron")]
    pub alert_low_stock_cron: String,
}

fn default_alert_low_stock_cron() -> String {
    "0 */5 * * * *".to_string()
}

impl Default for ScheduleTimeConfig {
    fn default() -> Self {
        Self {
            alert_low_stock_cron: default_alert_low_stock_cron(),
        }
    }
}
