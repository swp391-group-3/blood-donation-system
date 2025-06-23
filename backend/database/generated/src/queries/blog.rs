// This file was generated with `clorinde`. Do not modify.

#[derive(Debug)]
pub struct CreateParams<T1: crate::StringSql, T2: crate::StringSql, T3: crate::StringSql> {
    pub account_id: uuid::Uuid,
    pub title: T1,
    pub description: T2,
    pub content: T3,
}
#[derive(Clone, Copy, Debug)]
pub struct AddTagParams {
    pub blog_id: uuid::Uuid,
    pub tag_id: uuid::Uuid,
}
#[derive(Debug)]
pub struct UpdateParams<T1: crate::StringSql, T2: crate::StringSql, T3: crate::StringSql> {
    pub title: Option<T1>,
    pub description: Option<T2>,
    pub content: Option<T3>,
    pub id: uuid::Uuid,
    pub account_id: uuid::Uuid,
}
#[derive(Clone, Copy, Debug)]
pub struct DeleteParams {
    pub id: uuid::Uuid,
    pub account_id: uuid::Uuid,
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, utoipa::ToSchema)]
pub struct Blog {
    pub id: uuid::Uuid,
    pub name: String,
    pub title: String,
    pub description: String,
    pub content: String,
    pub created_at: chrono::DateTime<chrono::FixedOffset>,
}
pub struct BlogBorrowed<'a> {
    pub id: uuid::Uuid,
    pub name: &'a str,
    pub title: &'a str,
    pub description: &'a str,
    pub content: &'a str,
    pub created_at: chrono::DateTime<chrono::FixedOffset>,
}
impl<'a> From<BlogBorrowed<'a>> for Blog {
    fn from(
        BlogBorrowed {
            id,
            name,
            title,
            description,
            content,
            created_at,
        }: BlogBorrowed<'a>,
    ) -> Self {
        Self {
            id,
            name: name.into(),
            title: title.into(),
            description: description.into(),
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
pub struct BlogQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<BlogBorrowed, tokio_postgres::Error>,
    mapper: fn(BlogBorrowed) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> BlogQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(BlogBorrowed) -> R) -> BlogQuery<'c, 'a, 's, C, R, N> {
        BlogQuery {
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
        "INSERT INTO blogs (account_id, title, description, content) VALUES ($1, $2, $3, $4) RETURNING id",
    ))
}
pub struct CreateStmt(crate::client::async_::Stmt);
impl CreateStmt {
    pub fn bind<
        'c,
        'a,
        's,
        C: GenericClient,
        T1: crate::StringSql,
        T2: crate::StringSql,
        T3: crate::StringSql,
    >(
        &'s mut self,
        client: &'c C,
        account_id: &'a uuid::Uuid,
        title: &'a T1,
        description: &'a T2,
        content: &'a T3,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 4> {
        UuidUuidQuery {
            client,
            params: [account_id, title, description, content],
            stmt: &mut self.0,
            extractor: |row| Ok(row.try_get(0)?),
            mapper: |it| it,
        }
    }
}
impl<
        'c,
        'a,
        's,
        C: GenericClient,
        T1: crate::StringSql,
        T2: crate::StringSql,
        T3: crate::StringSql,
    >
    crate::client::async_::Params<
        'c,
        'a,
        's,
        CreateParams<T1, T2, T3>,
        UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 4>,
        C,
    > for CreateStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a CreateParams<T1, T2, T3>,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 4> {
        self.bind(
            client,
            &params.account_id,
            &params.title,
            &params.description,
            &params.content,
        )
    }
}
pub fn add_tag() -> AddTagStmt {
    AddTagStmt(crate::client::async_::Stmt::new(
        "INSERT INTO blog_tags (blog_id, tag_id) VALUES ($1, $2)",
    ))
}
pub struct AddTagStmt(crate::client::async_::Stmt);
impl AddTagStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        blog_id: &'a uuid::Uuid,
        tag_id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client.execute(stmt, &[blog_id, tag_id]).await
    }
}
impl<'a, C: GenericClient + Send + Sync>
    crate::client::async_::Params<
        'a,
        'a,
        'a,
        AddTagParams,
        std::pin::Pin<
            Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
        >,
        C,
    > for AddTagStmt
{
    fn params(
        &'a mut self,
        client: &'a C,
        params: &'a AddTagParams,
    ) -> std::pin::Pin<
        Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
    > {
        Box::pin(self.bind(client, &params.blog_id, &params.tag_id))
    }
}
pub fn get() -> GetStmt {
    GetStmt(crate::client::async_::Stmt::new(
        "SELECT id, (SELECT name FROM accounts WHERE id = blogs.account_id) AS name, title, description, content, created_at FROM blogs WHERE id = $1",
    ))
}
pub struct GetStmt(crate::client::async_::Stmt);
impl GetStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        id: &'a uuid::Uuid,
    ) -> BlogQuery<'c, 'a, 's, C, Blog, 1> {
        BlogQuery {
            client,
            params: [id],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<BlogBorrowed, tokio_postgres::Error> {
                Ok(BlogBorrowed {
                    id: row.try_get(0)?,
                    name: row.try_get(1)?,
                    title: row.try_get(2)?,
                    description: row.try_get(3)?,
                    content: row.try_get(4)?,
                    created_at: row.try_get(5)?,
                })
            },
            mapper: |it| Blog::from(it),
        }
    }
}
pub fn get_all() -> GetAllStmt {
    GetAllStmt(crate::client::async_::Stmt::new(
        "SELECT id, (SELECT name FROM accounts WHERE id = blogs.account_id) AS name, title, description, content, created_at FROM blogs WHERE content is null or (content LIKE '%' || $1 || '%' ) ORDER BY created_at DESC",
    ))
}
pub struct GetAllStmt(crate::client::async_::Stmt);
impl GetAllStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        content: &'a Option<T1>,
    ) -> BlogQuery<'c, 'a, 's, C, Blog, 1> {
        BlogQuery {
            client,
            params: [content],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<BlogBorrowed, tokio_postgres::Error> {
                Ok(BlogBorrowed {
                    id: row.try_get(0)?,
                    name: row.try_get(1)?,
                    title: row.try_get(2)?,
                    description: row.try_get(3)?,
                    content: row.try_get(4)?,
                    created_at: row.try_get(5)?,
                })
            },
            mapper: |it| Blog::from(it),
        }
    }
}
pub fn update() -> UpdateStmt {
    UpdateStmt(crate::client::async_::Stmt::new(
        "UPDATE blogs SET title = COALESCE($1, title), description = COALESCE($2, description), content = COALESCE($3, content) WHERE id = $4 AND account_id = $5",
    ))
}
pub struct UpdateStmt(crate::client::async_::Stmt);
impl UpdateStmt {
    pub async fn bind<
        'c,
        'a,
        's,
        C: GenericClient,
        T1: crate::StringSql,
        T2: crate::StringSql,
        T3: crate::StringSql,
    >(
        &'s mut self,
        client: &'c C,
        title: &'a Option<T1>,
        description: &'a Option<T2>,
        content: &'a Option<T3>,
        id: &'a uuid::Uuid,
        account_id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client
            .execute(stmt, &[title, description, content, id, account_id])
            .await
    }
}
impl<
        'a,
        C: GenericClient + Send + Sync,
        T1: crate::StringSql,
        T2: crate::StringSql,
        T3: crate::StringSql,
    >
    crate::client::async_::Params<
        'a,
        'a,
        'a,
        UpdateParams<T1, T2, T3>,
        std::pin::Pin<
            Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
        >,
        C,
    > for UpdateStmt
{
    fn params(
        &'a mut self,
        client: &'a C,
        params: &'a UpdateParams<T1, T2, T3>,
    ) -> std::pin::Pin<
        Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
    > {
        Box::pin(self.bind(
            client,
            &params.title,
            &params.description,
            &params.content,
            &params.id,
            &params.account_id,
        ))
    }
}
pub fn delete() -> DeleteStmt {
    DeleteStmt(crate::client::async_::Stmt::new(
        "DELETE FROM blogs WHERE id = $1 AND account_id = $2",
    ))
}
pub struct DeleteStmt(crate::client::async_::Stmt);
impl DeleteStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        id: &'a uuid::Uuid,
        account_id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client.execute(stmt, &[id, account_id]).await
    }
}
impl<'a, C: GenericClient + Send + Sync>
    crate::client::async_::Params<
        'a,
        'a,
        'a,
        DeleteParams,
        std::pin::Pin<
            Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
        >,
        C,
    > for DeleteStmt
{
    fn params(
        &'a mut self,
        client: &'a C,
        params: &'a DeleteParams,
    ) -> std::pin::Pin<
        Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
    > {
        Box::pin(self.bind(client, &params.id, &params.account_id))
    }
}
