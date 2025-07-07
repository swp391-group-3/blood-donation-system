use std::ops::Deref;

use chrono::{DateTime, TimeZone, Utc};
use validator::{Validate, ValidationError};

fn validate_past_date_time<Tz: TimeZone>(value: &DateTime<Tz>) -> Result<(), ValidationError> {
    if value.to_utc() <= Utc::now() {
        Err(ValidationError::new("timestamp"))
    } else {
        Ok(())
    }
}

#[derive(Debug, Validate)]
pub struct PastDateTime<Tz: TimeZone> {
    #[validate(custom(function = "validate_past_date_time"))]
    inner: DateTime<Tz>,
}

impl<Tz: TimeZone> From<DateTime<Tz>> for PastDateTime<Tz> {
    fn from(inner: DateTime<Tz>) -> Self {
        PastDateTime { inner }
    }
}

impl<Tz: TimeZone> Deref for PastDateTime<Tz> {
    type Target = DateTime<Tz>;

    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}
