use axum::http::StatusCode;
use lettre::{
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor, message::header::ContentType,
};

use crate::{
    CONFIG,
    controller::account::Account,
    error::{Error, Result},
};

pub async fn send(
    receiver: &Account,
    subject: String,
    body: String,
    mailer: &AsyncSmtpTransport<Tokio1Executor>,
) -> Result<()> {
    let email = match Message::builder()
        .from(CONFIG.email.username.parse().unwrap())
        .to(receiver.email.parse().unwrap())
        .subject(subject)
        .header(ContentType::TEXT_PLAIN)
        .body(body)
    {
        Ok(email) => email,
        Err(error) => {
            tracing::error!("Failed to create email with error: {:#?}", error);

            return Err(Error::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .build());
        }
    };

    if let Err(error) = mailer.send(email).await {
        tracing::error!("Failed to send email with error: {:#?}", error);

        return Err(Error::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .build());
    }

    Ok(())
}
