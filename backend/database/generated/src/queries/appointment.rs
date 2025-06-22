// This file was generated with `clorinde`. Do not modify.

#[derive(Clone, Copy, Debug)]
pub struct CreateParams {
    pub request_id: uuid::Uuid,
    pub member_id: uuid::Uuid,
}
#[derive(Clone, Copy, Debug)]
pub struct UpdateStatusParams {
    pub status: ctypes::AppointmentStatus,
    pub id: uuid::Uuid,
}
#[derive(Debug, Clone, PartialEq)]
pub struct Get {
    pub id: uuid::Uuid,
    pub request_id: uuid::Uuid,
    pub member_id: uuid::Uuid,
    pub status: ctypes::AppointmentStatus,
    pub title: String,
    pub start_time: crate::types::time::TimestampTz,
    pub end_time: crate::types::time::TimestampTz,
}
pub struct GetBorrowed<'a> {
    pub id: uuid::Uuid,
    pub request_id: uuid::Uuid,
    pub member_id: uuid::Uuid,
    pub status: ctypes::AppointmentStatus,
    pub title: &'a str,
    pub start_time: crate::types::time::TimestampTz,
    pub end_time: crate::types::time::TimestampTz,
}
impl<'a> From<GetBorrowed<'a>> for Get {
    fn from(
        GetBorrowed {
            id,
            request_id,
            member_id,
            status,
            title,
            start_time,
            end_time,
        }: GetBorrowed<'a>,
    ) -> Self {
        Self {
            id,
            request_id,
            member_id,
            status,
            title: title.into(),
            start_time,
            end_time,
        }
    }
}
#[derive(Debug, Clone, PartialEq)]
pub struct GetByMemberId {
    pub id: uuid::Uuid,
    pub request_id: uuid::Uuid,
    pub member_id: uuid::Uuid,
    pub status: ctypes::AppointmentStatus,
    pub title: String,
    pub start_time: crate::types::time::TimestampTz,
    pub end_time: crate::types::time::TimestampTz,
}
pub struct GetByMemberIdBorrowed<'a> {
    pub id: uuid::Uuid,
    pub request_id: uuid::Uuid,
    pub member_id: uuid::Uuid,
    pub status: ctypes::AppointmentStatus,
    pub title: &'a str,
    pub start_time: crate::types::time::TimestampTz,
    pub end_time: crate::types::time::TimestampTz,
}
impl<'a> From<GetByMemberIdBorrowed<'a>> for GetByMemberId {
    fn from(
        GetByMemberIdBorrowed {
            id,
            request_id,
            member_id,
            status,
            title,
            start_time,
            end_time,
        }: GetByMemberIdBorrowed<'a>,
    ) -> Self {
        Self {
            id,
            request_id,
            member_id,
            status,
            title: title.into(),
            start_time,
            end_time,
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
pub struct GetQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<GetBorrowed, tokio_postgres::Error>,
    mapper: fn(GetBorrowed) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> GetQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(GetBorrowed) -> R) -> GetQuery<'c, 'a, 's, C, R, N> {
        GetQuery {
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
pub struct GetByMemberIdQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<GetByMemberIdBorrowed, tokio_postgres::Error>,
    mapper: fn(GetByMemberIdBorrowed) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> GetByMemberIdQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(
        self,
        mapper: fn(GetByMemberIdBorrowed) -> R,
    ) -> GetByMemberIdQuery<'c, 'a, 's, C, R, N> {
        GetByMemberIdQuery {
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
        "INSERT INTO appointments(request_id, member_id) VALUES ($1, $2) RETURNING id",
    ))
}
pub struct CreateStmt(crate::client::async_::Stmt);
impl CreateStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        request_id: &'a uuid::Uuid,
        member_id: &'a uuid::Uuid,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 2> {
        UuidUuidQuery {
            client,
            params: [request_id, member_id],
            stmt: &mut self.0,
            extractor: |row| Ok(row.try_get(0)?),
            mapper: |it| it,
        }
    }
}
impl<'c, 'a, 's, C: GenericClient>
    crate::client::async_::Params<
        'c,
        'a,
        's,
        CreateParams,
        UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 2>,
        C,
    > for CreateStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a CreateParams,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 2> {
        self.bind(client, &params.request_id, &params.member_id)
    }
}
pub fn get() -> GetStmt {
    GetStmt(crate::client::async_::Stmt::new(
        "SELECT *, (SELECT title FROM blood_requests WHERE id = appointments.request_id) AS title, (SELECT start_time FROM blood_requests WHERE id = appointments.request_id) AS start_time, (SELECT end_time FROM blood_requests WHERE id = appointments.request_id) AS end_time FROM appointments WHERE id = $1",
    ))
}
pub struct GetStmt(crate::client::async_::Stmt);
impl GetStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        id: &'a uuid::Uuid,
    ) -> GetQuery<'c, 'a, 's, C, Get, 1> {
        GetQuery {
            client,
            params: [id],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<GetBorrowed, tokio_postgres::Error> {
                Ok(GetBorrowed {
                    id: row.try_get(0)?,
                    request_id: row.try_get(1)?,
                    member_id: row.try_get(2)?,
                    status: row.try_get(3)?,
                    title: row.try_get(4)?,
                    start_time: row.try_get(5)?,
                    end_time: row.try_get(6)?,
                })
            },
            mapper: |it| Get::from(it),
        }
    }
}
pub fn get_by_member_id() -> GetByMemberIdStmt {
    GetByMemberIdStmt(crate::client::async_::Stmt::new(
        "SELECT *, (SELECT title FROM blood_requests WHERE id = appointments.request_id) AS title, (SELECT start_time FROM blood_requests WHERE id = appointments.request_id) AS start_time, (SELECT end_time FROM blood_requests WHERE id = appointments.request_id) AS end_time FROM appointments WHERE member_id = $1",
    ))
}
pub struct GetByMemberIdStmt(crate::client::async_::Stmt);
impl GetByMemberIdStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        member_id: &'a uuid::Uuid,
    ) -> GetByMemberIdQuery<'c, 'a, 's, C, GetByMemberId, 1> {
        GetByMemberIdQuery {
            client,
            params: [member_id],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<GetByMemberIdBorrowed, tokio_postgres::Error> {
                    Ok(GetByMemberIdBorrowed {
                        id: row.try_get(0)?,
                        request_id: row.try_get(1)?,
                        member_id: row.try_get(2)?,
                        status: row.try_get(3)?,
                        title: row.try_get(4)?,
                        start_time: row.try_get(5)?,
                        end_time: row.try_get(6)?,
                    })
                },
            mapper: |it| GetByMemberId::from(it),
        }
    }
}
pub fn update_status() -> UpdateStatusStmt {
    UpdateStatusStmt(crate::client::async_::Stmt::new(
        "UPDATE appointments SET status = $1 WHERE id = $2",
    ))
}
pub struct UpdateStatusStmt(crate::client::async_::Stmt);
impl UpdateStatusStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        status: &'a ctypes::AppointmentStatus,
        id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client.execute(stmt, &[status, id]).await
    }
}
impl<'a, C: GenericClient + Send + Sync>
    crate::client::async_::Params<
        'a,
        'a,
        'a,
        UpdateStatusParams,
        std::pin::Pin<
            Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
        >,
        C,
    > for UpdateStatusStmt
{
    fn params(
        &'a mut self,
        client: &'a C,
        params: &'a UpdateStatusParams,
    ) -> std::pin::Pin<
        Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
    > {
        Box::pin(self.bind(client, &params.status, &params.id))
    }
}
