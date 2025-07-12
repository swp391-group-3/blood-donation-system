// This file was generated with `clorinde`. Do not modify.

#[derive(Debug)]
pub struct CreateParams<T1: crate::StringSql> {
    pub blog_id: uuid::Uuid,
    pub account_id: uuid::Uuid,
    pub content: T1,
}
#[derive(Debug)]
pub struct UpdateParams<T1: crate::StringSql> {
    pub content: Option<T1>,
    pub id: uuid::Uuid,
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, utoipa::ToSchema)]
pub struct Comment {
    pub id: uuid::Uuid,
    pub blog_id: uuid::Uuid,
    pub owner: String,
    pub content: String,
    pub created_at: chrono::DateTime<chrono::FixedOffset>,
}
pub struct CommentBorrowed<'a> {
    pub id: uuid::Uuid,
    pub blog_id: uuid::Uuid,
    pub owner: &'a str,
    pub content: &'a str,
    pub created_at: chrono::DateTime<chrono::FixedOffset>,
}
impl<'a> From<CommentBorrowed<'a>> for Comment {
    fn from(
        CommentBorrowed {
            id,
            blog_id,
            owner,
            content,
            created_at,
        }: CommentBorrowed<'a>,
    ) -> Self {
        Self {
            id,
            blog_id,
            owner: owner.into(),
            content: content.into(),
            created_at,
        }
    }
}
use crate::client::async_::GenericClient;
use futures::{self, StreamExt, TryStreamExt};
pub struct UuidUuidQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<uuid::Uuid, tokio_postgres::Error>,
    mapper: fn(uuid::Uuid) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> UuidUuidQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(uuid::Uuid) -> R) -> UuidUuidQuery<'c, 'a, 's, C, R, N> {
        UuidUuidQuery {
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
pub struct CommentQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<CommentBorrowed, tokio_postgres::Error>,
    mapper: fn(CommentBorrowed) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> CommentQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(CommentBorrowed) -> R) -> CommentQuery<'c, 'a, 's, C, R, N> {
        CommentQuery {
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
        "INSERT INTO comments(blog_id, account_id, content) VALUES($1, $2, $3) RETURNING id",
    ))
}
pub struct CreateStmt(crate::client::async_::Stmt);
impl CreateStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        blog_id: &'a uuid::Uuid,
        account_id: &'a uuid::Uuid,
        content: &'a T1,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 3> {
        UuidUuidQuery {
            client,
            params: [blog_id, account_id, content],
            stmt: &mut self.0,
            extractor: |row| Ok(row.try_get(0)?),
            mapper: |it| it,
        }
    }
}
impl<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>
    crate::client::async_::Params<
        'c,
        'a,
        's,
        CreateParams<T1>,
        UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 3>,
        C,
    > for CreateStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a CreateParams<T1>,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 3> {
        self.bind(client, &params.blog_id, &params.account_id, &params.content)
    }
}
pub fn get_by_blog_id() -> GetByBlogIdStmt {
    GetByBlogIdStmt(crate::client::async_::Stmt::new(
        "SELECT id, blog_id, ( SELECT name FROM accounts WHERE id = comments.account_id ) AS owner, content, created_at FROM comments WHERE blog_id = $1 ORDER BY created_at DESC",
    ))
}
pub struct GetByBlogIdStmt(crate::client::async_::Stmt);
impl GetByBlogIdStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        blog_id: &'a uuid::Uuid,
    ) -> CommentQuery<'c, 'a, 's, C, Comment, 1> {
        CommentQuery {
            client,
            params: [blog_id],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<CommentBorrowed, tokio_postgres::Error> {
                    Ok(CommentBorrowed {
                        id: row.try_get(0)?,
                        blog_id: row.try_get(1)?,
                        owner: row.try_get(2)?,
                        content: row.try_get(3)?,
                        created_at: row.try_get(4)?,
                    })
                },
            mapper: |it| Comment::from(it),
        }
    }
}
pub fn delete() -> DeleteStmt {
    DeleteStmt(crate::client::async_::Stmt::new(
        "DELETE FROM comments WHERE id = $1",
    ))
}
pub struct DeleteStmt(crate::client::async_::Stmt);
impl DeleteStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client.execute(stmt, &[id]).await
    }
}
pub fn update() -> UpdateStmt {
    UpdateStmt(crate::client::async_::Stmt::new(
        "UPDATE comments SET content = COALESCE($1, content) WHERE id = $2",
    ))
}
pub struct UpdateStmt(crate::client::async_::Stmt);
impl UpdateStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        content: &'a Option<T1>,
        id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client.execute(stmt, &[content, id]).await
    }
}
impl<'a, C: GenericClient + Send + Sync, T1: crate::StringSql>
    crate::client::async_::Params<
        'a,
        'a,
        'a,
        UpdateParams<T1>,
        std::pin::Pin<
            Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
        >,
        C,
    > for UpdateStmt
{
    fn params(
        &'a mut self,
        client: &'a C,
        params: &'a UpdateParams<T1>,
    ) -> std::pin::Pin<
        Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
    > {
        Box::pin(self.bind(client, &params.content, &params.id))
    }
}
