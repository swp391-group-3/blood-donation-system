// This file was generated with `clorinde`. Do not modify.

#[derive(Debug)]
pub struct CreateParams<T1: crate::StringSql> {
    pub account_id: uuid::Uuid,
    pub role: ctypes::ChatRole,
    pub content: T1,
    pub created_at: chrono::DateTime<chrono::FixedOffset>,
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, utoipa::ToSchema)]
pub struct Chat {
    pub id: uuid::Uuid,
    pub account_id: uuid::Uuid,
    pub role: ctypes::ChatRole,
    pub content: String,
    pub created_at: chrono::DateTime<chrono::FixedOffset>,
}
pub struct ChatBorrowed<'a> {
    pub id: uuid::Uuid,
    pub account_id: uuid::Uuid,
    pub role: ctypes::ChatRole,
    pub content: &'a str,
    pub created_at: chrono::DateTime<chrono::FixedOffset>,
}
impl<'a> From<ChatBorrowed<'a>> for Chat {
    fn from(
        ChatBorrowed {
            id,
            account_id,
            role,
            content,
            created_at,
        }: ChatBorrowed<'a>,
    ) -> Self {
        Self {
            id,
            account_id,
            role,
            content: content.into(),
            created_at,
        }
    }
}
use crate::client::async_::GenericClient;
use futures::{self, StreamExt, TryStreamExt};
pub struct ChatQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<ChatBorrowed, tokio_postgres::Error>,
    mapper: fn(ChatBorrowed) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> ChatQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(ChatBorrowed) -> R) -> ChatQuery<'c, 'a, 's, C, R, N> {
        ChatQuery {
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
        "INSERT INTO chat_histories( account_id, role, content, created_at ) VALUES( $1, $2, $3, $4 )",
    ))
}
pub struct CreateStmt(crate::client::async_::Stmt);
impl CreateStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        account_id: &'a uuid::Uuid,
        role: &'a ctypes::ChatRole,
        content: &'a T1,
        created_at: &'a chrono::DateTime<chrono::FixedOffset>,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client
            .execute(stmt, &[account_id, role, content, created_at])
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
            &params.account_id,
            &params.role,
            &params.content,
            &params.created_at,
        ))
    }
}
pub fn get_by_account_id() -> GetByAccountIdStmt {
    GetByAccountIdStmt(crate::client::async_::Stmt::new(
        "SELECT * FROM chat_histories WHERE account_id = $1",
    ))
}
pub struct GetByAccountIdStmt(crate::client::async_::Stmt);
impl GetByAccountIdStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        account_id: &'a uuid::Uuid,
    ) -> ChatQuery<'c, 'a, 's, C, Chat, 1> {
        ChatQuery {
            client,
            params: [account_id],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<ChatBorrowed, tokio_postgres::Error> {
                Ok(ChatBorrowed {
                    id: row.try_get(0)?,
                    account_id: row.try_get(1)?,
                    role: row.try_get(2)?,
                    content: row.try_get(3)?,
                    created_at: row.try_get(4)?,
                })
            },
            mapper: |it| Chat::from(it),
        }
    }
}
