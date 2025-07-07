use axum::{
    Json,
    extract::{FromRequest, Request},
    http::StatusCode,
};
use chrono::{DateTime, TimeZone, Utc};
use serde::de::DeserializeOwned;
use std::{
    collections::HashMap,
    fmt::{self, Write},
};
use validator::{Validate, ValidationError, ValidationErrors, ValidationErrorsKind};

use crate::error::Error;

pub fn validate_past_date_time<Tz: TimeZone>(value: &DateTime<Tz>) -> Result<(), ValidationError> {
    if value.to_utc() <= Utc::now() {
        Ok(())
    } else {
        Err(ValidationError::new("date time"))
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

#[derive(Debug, Clone, Copy, Default)]
pub struct ValidJson<T>(pub T);

fn display_struct(fmt: &mut String, errs: &ValidationErrors, path: &str) -> fmt::Result {
    let mut full_path = String::new();
    write!(&mut full_path, "{}.", path)?;
    let base_len = full_path.len();
    for (path, err) in errs.errors() {
        write!(&mut full_path, "{}", path)?;
        display_errors(fmt, err, &full_path)?;
        full_path.truncate(base_len);
    }
    Ok(())
}

fn display_errors(fmt: &mut String, errs: &ValidationErrorsKind, path: &str) -> fmt::Result {
    match errs {
        ValidationErrorsKind::Field(errs) => {
            let len = errs.len();
            for (idx, err) in errs.iter().enumerate() {
                if idx + 1 == len {
                    write!(fmt, "{}", err)?;
                } else {
                    write!(fmt, "{}, ", err)?;
                }
            }
            Ok(())
        }
        ValidationErrorsKind::Struct(errs) => display_struct(fmt, errs, path),
        ValidationErrorsKind::List(errs) => {
            let mut full_path = String::new();
            write!(&mut full_path, "{}", path)?;
            let base_len = full_path.len();
            for (idx, err) in errs.iter() {
                write!(&mut full_path, "[{}]", idx)?;
                display_struct(fmt, err, &full_path)?;
                full_path.truncate(base_len);
            }
            Ok(())
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
