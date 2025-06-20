use anyhow::Result;
use lettre::{
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor, message::header::ContentType,
    transport::smtp::authentication::Credentials,
};

use crate::{CONFIG, controller::account::Account};

#[allow(unused)]
pub async fn send(receiver: &Account, subject: String, body: String) -> Result<()> {
    let creds = Credentials::new(
        CONFIG.email.username.to_owned(),
        CONFIG.email.password.to_owned(),
    );

    let mailer = AsyncSmtpTransport::<Tokio1Executor>::relay("smtp.gmail.com")?
        .credentials(creds)
        .build();

    let email = Message::builder()
        .from(CONFIG.email.username.parse().unwrap())
        .to(receiver.email.parse().unwrap())
        .subject(subject)
        .header(ContentType::TEXT_PLAIN)
        .body(body)?;

    mailer.send(email).await?;

    Ok(())
}
