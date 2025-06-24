use database::queries::account::Account;
use lettre::{
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor, message::header::ContentType,
};

use crate::{
    CONFIG,
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
            tracing::error!(?error, "Failed to create email");

            return Err(Error::internal());
        }
    };

    // if let Err(error) = mailer.send(email).await {
    //     tracing::error!(?error, "Failed to send email");
    //
    //     return Err(Error::internal());
    // }

    Ok(())
}
