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
#[derive(Debug)]
pub struct RejectParams<T1: crate::StringSql> {
    pub status: ctypes::AppointmentStatus,
    pub reason: T1,
    pub id: uuid::Uuid,
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, utoipa::ToSchema)]
pub struct Appointment {
    pub id: uuid::Uuid,
    pub request_id: uuid::Uuid,
    pub member_id: uuid::Uuid,
    pub status: ctypes::AppointmentStatus,
    pub reason: String,
}
pub struct AppointmentBorrowed<'a> {
    pub id: uuid::Uuid,
    pub request_id: uuid::Uuid,
    pub member_id: uuid::Uuid,
    pub status: ctypes::AppointmentStatus,
    pub reason: &'a str,
}
impl<'a> From<AppointmentBorrowed<'a>> for Appointment {
    fn from(
        AppointmentBorrowed {
            id,
            request_id,
            member_id,
            status,
            reason,
        }: AppointmentBorrowed<'a>,
    ) -> Self {
        Self {
            id,
            request_id,
            member_id,
            status,
            reason: reason.into(),
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
pub struct AppointmentQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<AppointmentBorrowed, tokio_postgres::Error>,
    mapper: fn(AppointmentBorrowed) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> AppointmentQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(
        self,
        mapper: fn(AppointmentBorrowed) -> R,
    ) -> AppointmentQuery<'c, 'a, 's, C, R, N> {
        AppointmentQuery {
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
        "SELECT * FROM appointments WHERE id = $1",
    ))
}
pub struct GetStmt(crate::client::async_::Stmt);
impl GetStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        id: &'a uuid::Uuid,
    ) -> AppointmentQuery<'c, 'a, 's, C, Appointment, 1> {
        AppointmentQuery {
            client,
            params: [id],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<AppointmentBorrowed, tokio_postgres::Error> {
                    Ok(AppointmentBorrowed {
                        id: row.try_get(0)?,
                        request_id: row.try_get(1)?,
                        member_id: row.try_get(2)?,
                        status: row.try_get(3)?,
                        reason: row.try_get(4)?,
                    })
                },
            mapper: |it| Appointment::from(it),
        }
    }
}
pub fn get_by_member_id() -> GetByMemberIdStmt {
    GetByMemberIdStmt(crate::client::async_::Stmt::new(
        "SELECT * FROM appointments WHERE member_id = $1",
    ))
}
pub struct GetByMemberIdStmt(crate::client::async_::Stmt);
impl GetByMemberIdStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        member_id: &'a uuid::Uuid,
    ) -> AppointmentQuery<'c, 'a, 's, C, Appointment, 1> {
        AppointmentQuery {
            client,
            params: [member_id],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<AppointmentBorrowed, tokio_postgres::Error> {
                    Ok(AppointmentBorrowed {
                        id: row.try_get(0)?,
                        request_id: row.try_get(1)?,
                        member_id: row.try_get(2)?,
                        status: row.try_get(3)?,
                        reason: row.try_get(4)?,
                    })
                },
            mapper: |it| Appointment::from(it),
        }
    }
}
pub fn get_all() -> GetAllStmt {
    GetAllStmt(crate::client::async_::Stmt::new(
        "SELECT * FROM appointments",
    ))
}
pub struct GetAllStmt(crate::client::async_::Stmt);
impl GetAllStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> AppointmentQuery<'c, 'a, 's, C, Appointment, 0> {
        AppointmentQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<AppointmentBorrowed, tokio_postgres::Error> {
                    Ok(AppointmentBorrowed {
                        id: row.try_get(0)?,
                        request_id: row.try_get(1)?,
                        member_id: row.try_get(2)?,
                        status: row.try_get(3)?,
                        reason: row.try_get(4)?,
                    })
                },
            mapper: |it| Appointment::from(it),
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
pub fn reject() -> RejectStmt {
    RejectStmt(crate::client::async_::Stmt::new(
        "UPDATE appointments SET status = $1, reason = $2 WHERE id = $3",
    ))
}
pub struct RejectStmt(crate::client::async_::Stmt);
impl RejectStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        status: &'a ctypes::AppointmentStatus,
        reason: &'a T1,
        id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client.execute(stmt, &[status, reason, id]).await
    }
}
impl<'a, C: GenericClient + Send + Sync, T1: crate::StringSql>
    crate::client::async_::Params<
        'a,
        'a,
        'a,
        RejectParams<T1>,
        std::pin::Pin<
            Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
        >,
        C,
    > for RejectStmt
{
    fn params(
        &'a mut self,
        client: &'a C,
        params: &'a RejectParams<T1>,
    ) -> std::pin::Pin<
        Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
    > {
        Box::pin(self.bind(client, &params.status, &params.reason, &params.id))
    }
}
