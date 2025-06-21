// This file was generated with `clorinde`. Do not modify.

#[derive(Debug)]
pub struct CreateParams<T1: crate::StringSql> {
    pub question_id: i32,
    pub appointment_id: uuid::Uuid,
    pub content: T1,
}
#[derive(Debug, Clone, PartialEq)]
pub struct GetByAppointmentId {
    pub question: String,
    pub answer: String,
}
pub struct GetByAppointmentIdBorrowed<'a> {
    pub question: &'a str,
    pub answer: &'a str,
}
impl<'a> From<GetByAppointmentIdBorrowed<'a>> for GetByAppointmentId {
    fn from(
        GetByAppointmentIdBorrowed { question, answer }: GetByAppointmentIdBorrowed<'a>,
    ) -> Self {
        Self {
            question: question.into(),
            answer: answer.into(),
        }
    }
}
use crate::client::async_::GenericClient;
use futures::{self, StreamExt, TryStreamExt};
pub struct GetByAppointmentIdQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor:
        fn(&tokio_postgres::Row) -> Result<GetByAppointmentIdBorrowed, tokio_postgres::Error>,
    mapper: fn(GetByAppointmentIdBorrowed) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> GetByAppointmentIdQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(
        self,
        mapper: fn(GetByAppointmentIdBorrowed) -> R,
    ) -> GetByAppointmentIdQuery<'c, 'a, 's, C, R, N> {
        GetByAppointmentIdQuery {
            client: self.client,
            params: self.params,
            stmt: self.stmt,
            extractor: self.extractor,
            mapper,
        }
    }
    pub async fn one(self) -> Result<T, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        let row = self.client.query_one(stmt, &self.params).await?;
        Ok((self.mapper)((self.extractor)(&row)?))
    }
    pub async fn all(self) -> Result<Vec<T>, tokio_postgres::Error> {
        self.iter().await?.try_collect().await
    }
    pub async fn opt(self) -> Result<Option<T>, tokio_postgres::Error> {
        let stmt = self.stmt.prepare(self.client).await?;
        Ok(self
            .client
            .query_opt(stmt, &self.params)
            .await?
            .map(|row| {
                let extracted = (self.extractor)(&row)?;
                Ok((self.mapper)(extracted))
            })
            .transpose()?)
    }
    pub async fn iter(
        self,
    ) -> Result<
        impl futures::Stream<Item = Result<T, tokio_postgres::Error>> + 'c,
        tokio_postgres::Error,
    > {
        let stmt = self.stmt.prepare(self.client).await?;
        let it = self
            .client
            .query_raw(stmt, crate::slice_iter(&self.params))
            .await?
            .map(move |res| {
                res.and_then(|row| {
                    let extracted = (self.extractor)(&row)?;
                    Ok((self.mapper)(extracted))
                })
            })
            .into_stream();
        Ok(it)
    }
}
pub fn create() -> CreateStmt {
    CreateStmt(crate::client::async_::Stmt::new(
        "INSERT INTO answers(question_id, appointment_id, content) VALUES ($1, $2, $3)",
    ))
}
pub struct CreateStmt(crate::client::async_::Stmt);
impl CreateStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        question_id: &'a i32,
        appointment_id: &'a uuid::Uuid,
        content: &'a T1,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client
            .execute(stmt, &[question_id, appointment_id, content])
            .await
    }
}
impl<'a, C: GenericClient + Send + Sync, T1: crate::StringSql>
    crate::client::async_::Params<
        'a,
        'a,
        'a,
        CreateParams<T1>,
        std::pin::Pin<
            Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
        >,
        C,
    > for CreateStmt
{
    fn params(
        &'a mut self,
        client: &'a C,
        params: &'a CreateParams<T1>,
    ) -> std::pin::Pin<
        Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
    > {
        Box::pin(self.bind(
            client,
            &params.question_id,
            &params.appointment_id,
            &params.content,
        ))
    }
}
pub fn get_by_appointment_id() -> GetByAppointmentIdStmt {
    GetByAppointmentIdStmt(crate::client::async_::Stmt::new(
        "SELECT questions.content as question, answers.content as answer FROM answers INNER JOIN questions ON questions.id = answers.question_id WHERE appointment_id = $1",
    ))
}
pub struct GetByAppointmentIdStmt(crate::client::async_::Stmt);
impl GetByAppointmentIdStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        appointment_id: &'a uuid::Uuid,
    ) -> GetByAppointmentIdQuery<'c, 'a, 's, C, GetByAppointmentId, 1> {
        GetByAppointmentIdQuery {
            client,
            params: [appointment_id],
            stmt: &mut self.0,
            extractor: |
                row: &tokio_postgres::Row,
            | -> Result<GetByAppointmentIdBorrowed, tokio_postgres::Error> {
                Ok(GetByAppointmentIdBorrowed {
                    question: row.try_get(0)?,
                    answer: row.try_get(1)?,
                })
            },
            mapper: |it| GetByAppointmentId::from(it),
        }
    }
}
