use chrono::{DateTime, Utc};
use validator::ValidationError;

#[allow(unused)]
pub fn date_time_must_after_now(value: &DateTime<Utc>) -> Result<(), ValidationError> {
    let now = Utc::now();

    if value <= &now {
        return Err(ValidationError::new("timestamp"));
    }

    Ok(())
}
