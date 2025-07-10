use axum::{
    Json,
    extract::{FromRequest, Request},
    http::StatusCode,
};
use chrono::{DateTime, Duration, NaiveDate, TimeZone, Utc};
use itertools::Itertools;
use serde::de::DeserializeOwned;
use std::collections::HashMap;
use validator::{Validate, ValidationError, ValidationErrors, ValidationErrorsKind};

use crate::error::Error;

#[allow(unused)]
pub fn validate_past_date_time<Tz: TimeZone>(value: &DateTime<Tz>) -> Result<(), ValidationError> {
    if value.to_utc() <= Utc::now() {
        Ok(())
    } else {
        Err(ValidationError::new("date time"))
    }
}

pub fn validate_future_date_time<Tz: TimeZone>(
    value: &DateTime<Tz>,
) -> Result<(), ValidationError> {
    if value.to_utc() >= Utc::now() {
        Ok(())
    } else {
        Err(ValidationError::new("date time"))
    }
}

pub fn validate_birthday(value: &NaiveDate) -> Result<(), ValidationError> {
    let cons = Utc::now().date_naive() - Duration::days(365 * 16);
    if *value <= cons {
        Ok(())
    } else {
        Err(ValidationError::new("date"))
    }
}

pub struct DateTimeRange<Tz: TimeZone> {
    pub start: DateTime<Tz>,
    pub end: DateTime<Tz>,
}

pub fn validate_date_time_range<Tz: TimeZone>(
    range: &DateTimeRange<Tz>,
) -> Result<(), ValidationError> {
    if range.start < range.end {
        Ok(())
    } else {
        Err(ValidationError::new("date time range"))
    }
}

pub fn validate_phone(value: &str) -> Result<(), ValidationError> {
    let is_valid =
        value.len() == 10 && value.starts_with('0') && value.chars().all(|c| c.is_ascii_digit());

    if is_valid {
        Ok(())
    } else {
        Err(ValidationError::new("phone number"))
    }
}

#[derive(Debug, Clone, Copy, Default)]
pub struct ValidJson<T>(pub T);

fn display_struct(res: &mut String, errs: &ValidationErrors, path: &str) {
    let mut full_path = format!("{path}.");
    let base_len = full_path.len();

    for (path, err) in errs.errors() {
        full_path.push_str(path);
        display_errors(res, err, &full_path);
        full_path.truncate(base_len);
    }
}

#[allow(unstable_name_collisions)]
fn display_errors(res: &mut String, errs: &ValidationErrorsKind, path: &str) {
    match errs {
        ValidationErrorsKind::Field(errs) => {
            errs.iter()
                .map(|err| err.to_string())
                .intersperse(", ".to_string())
                .for_each(|s| res.push_str(&s));
        }
        ValidationErrorsKind::Struct(errs) => display_struct(res, errs, path),
        ValidationErrorsKind::List(errs) => {
            let mut full_path = path.to_string();
            let base_len = full_path.len();
            for (idx, err) in errs.iter() {
                full_path.push_str(&format!("[{idx}]"));
                display_struct(res, err, &full_path);
                full_path.truncate(base_len);
            }
        }
    }
}

impl<T, S> FromRequest<S> for ValidJson<T>
where
    T: DeserializeOwned + Validate,
    S: Send + Sync,
{
    type Rejection = Error;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let data = match Json::<T>::from_request(req, state).await {
            Ok(data) => data.0,
            Err(error) => {
                return Err(Error::builder()
                    .status(error.status())
                    .message(error.body_text())
                    .build());
            }
        };
        match data.validate() {
            Ok(_) => Ok(ValidJson(data)),
            Err(errs) => {
                let details: HashMap<_, _> = errs
                    .0
                    .into_iter()
                    .map(|(path, errs)| {
                        let mut message = String::new();
                        display_errors(&mut message, &errs, &path);

                        (path.to_string(), message)
                    })
                    .collect();

                Err(Error::builder()
                    .status(StatusCode::BAD_REQUEST)
                    .message("Invalid data".to_string())
                    .details(details)
                    .build())
            }
        }
    }
}
