// This file was generated with `clorinde`. Do not modify.

#[derive(Clone, Copy, Debug)]
pub struct CreateParams {
    pub request_id: uuid::Uuid,
    pub donor_id: uuid::Uuid,
}
#[derive(Debug)]
pub struct CountParams<T1: crate::StringSql> {
    pub query: Option<T1>,
    pub status: Option<ctypes::AppointmentStatus>,
}
#[derive(Debug)]
pub struct GetAllParams<T1: crate::StringSql> {
    pub query: Option<T1>,
    pub status: Option<ctypes::AppointmentStatus>,
    pub page_size: i32,
    pub page_index: i32,
}
#[derive(Clone, Copy, Debug)]
pub struct UpdateStatusParams {
    pub status: ctypes::AppointmentStatus,
    pub id: uuid::Uuid,
}
#[derive(Debug)]
pub struct RejectParams<T1: crate::StringSql> {
    pub reason: T1,
    pub id: uuid::Uuid,
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, utoipa::ToSchema)]
pub struct Appointment {
    pub id: uuid::Uuid,
    pub request_id: uuid::Uuid,
    pub donor_id: uuid::Uuid,
    pub status: ctypes::AppointmentStatus,
    pub reason: Option<String>,
}
pub struct AppointmentBorrowed<'a> {
    pub id: uuid::Uuid,
    pub request_id: uuid::Uuid,
    pub donor_id: uuid::Uuid,
    pub status: ctypes::AppointmentStatus,
    pub reason: Option<&'a str>,
}
impl<'a> From<AppointmentBorrowed<'a>> for Appointment {
    fn from(
        AppointmentBorrowed {
            id,
            request_id,
            donor_id,
            status,
            reason,
        }: AppointmentBorrowed<'a>,
    ) -> Self {
        Self {
            id,
            request_id,
            donor_id,
            status,
            reason: reason.map(|v| v.into()),
        }
    }
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, Copy, utoipa::ToSchema)]
pub struct AppointmentsStats {
    pub on_process_appointments: i64,
    pub approved_appointments: i64,
    pub done_appointments: i64,
    pub rejected_appointments: i64,
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
pub struct I64Query<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<i64, tokio_postgres::Error>,
    mapper: fn(i64) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> I64Query<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(i64) -> R) -> I64Query<'c, 'a, 's, C, R, N> {
        I64Query {
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
pub struct AppointmentsStatsQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<AppointmentsStats, tokio_postgres::Error>,
    mapper: fn(AppointmentsStats) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> AppointmentsStatsQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(
        self,
        mapper: fn(AppointmentsStats) -> R,
    ) -> AppointmentsStatsQuery<'c, 'a, 's, C, R, N> {
        AppointmentsStatsQuery {
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
        "INSERT INTO appointments(request_id, donor_id) VALUES ($1, $2) RETURNING id",
    ))
}
pub struct CreateStmt(crate::client::async_::Stmt);
impl CreateStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        request_id: &'a uuid::Uuid,
        donor_id: &'a uuid::Uuid,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 2> {
        UuidUuidQuery {
            client,
            params: [request_id, donor_id],
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
        self.bind(client, &params.request_id, &params.donor_id)
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
                        donor_id: row.try_get(2)?,
                        status: row.try_get(3)?,
                        reason: row.try_get(4)?,
                    })
                },
            mapper: |it| Appointment::from(it),
        }
    }
}
pub fn get_by_donor_id() -> GetByDonorIdStmt {
    GetByDonorIdStmt(crate::client::async_::Stmt::new(
        "SELECT * FROM appointments WHERE donor_id = $1",
    ))
}
pub struct GetByDonorIdStmt(crate::client::async_::Stmt);
impl GetByDonorIdStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        donor_id: &'a uuid::Uuid,
    ) -> AppointmentQuery<'c, 'a, 's, C, Appointment, 1> {
        AppointmentQuery {
            client,
            params: [donor_id],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<AppointmentBorrowed, tokio_postgres::Error> {
                    Ok(AppointmentBorrowed {
                        id: row.try_get(0)?,
                        request_id: row.try_get(1)?,
                        donor_id: row.try_get(2)?,
                        status: row.try_get(3)?,
                        reason: row.try_get(4)?,
                    })
                },
            mapper: |it| Appointment::from(it),
        }
    }
}
pub fn count() -> CountStmt {
    CountStmt(crate::client::async_::Stmt::new(
        "SELECT COUNT(id) FROM appointments WHERE ( $1::text IS NULL OR EXISTS ( SELECT 1 FROM accounts WHERE (name % $1 OR email % $1) AND accounts.id = appointments.donor_id LIMIT 1 ) ) AND ( $2::appointment_status IS NULL OR status = $2 ) AND status NOT IN ('done'::appointment_status, 'rejected'::appointment_status)",
    ))
}
pub struct CountStmt(crate::client::async_::Stmt);
impl CountStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        query: &'a Option<T1>,
        status: &'a Option<ctypes::AppointmentStatus>,
    ) -> I64Query<'c, 'a, 's, C, i64, 2> {
        I64Query {
            client,
            params: [query, status],
            stmt: &mut self.0,
            extractor: |row| Ok(row.try_get(0)?),
            mapper: |it| it,
        }
    }
}
impl<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>
    crate::client::async_::Params<'c, 'a, 's, CountParams<T1>, I64Query<'c, 'a, 's, C, i64, 2>, C>
    for CountStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a CountParams<T1>,
    ) -> I64Query<'c, 'a, 's, C, i64, 2> {
        self.bind(client, &params.query, &params.status)
    }
}
pub fn get_all() -> GetAllStmt {
    GetAllStmt(crate::client::async_::Stmt::new(
        "SELECT * FROM appointments WHERE ( $1::text IS NULL OR EXISTS ( SELECT 1 FROM accounts WHERE (name % $1 OR email % $1) AND accounts.id = appointments.donor_id LIMIT 1 ) ) AND ( $2::appointment_status IS NULL OR status = $2 ) AND status NOT IN ('done'::appointment_status, 'rejected'::appointment_status) LIMIT $3::int OFFSET $3::int * $4::int",
    ))
}
pub struct GetAllStmt(crate::client::async_::Stmt);
impl GetAllStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        query: &'a Option<T1>,
        status: &'a Option<ctypes::AppointmentStatus>,
        page_size: &'a i32,
        page_index: &'a i32,
    ) -> AppointmentQuery<'c, 'a, 's, C, Appointment, 4> {
        AppointmentQuery {
            client,
            params: [query, status, page_size, page_index],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<AppointmentBorrowed, tokio_postgres::Error> {
                    Ok(AppointmentBorrowed {
                        id: row.try_get(0)?,
                        request_id: row.try_get(1)?,
                        donor_id: row.try_get(2)?,
                        status: row.try_get(3)?,
                        reason: row.try_get(4)?,
                    })
                },
            mapper: |it| Appointment::from(it),
        }
    }
}
impl<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>
    crate::client::async_::Params<
        'c,
        'a,
        's,
        GetAllParams<T1>,
        AppointmentQuery<'c, 'a, 's, C, Appointment, 4>,
        C,
    > for GetAllStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a GetAllParams<T1>,
    ) -> AppointmentQuery<'c, 'a, 's, C, Appointment, 4> {
        self.bind(
            client,
            &params.query,
            &params.status,
            &params.page_size,
            &params.page_index,
        )
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
        "UPDATE appointments SET status = 'rejected'::appointment_status, reason = $1 WHERE id = $2",
    ))
}
pub struct RejectStmt(crate::client::async_::Stmt);
impl RejectStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        reason: &'a T1,
        id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client.execute(stmt, &[reason, id]).await
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
        Box::pin(self.bind(client, &params.reason, &params.id))
    }
}
pub fn get_stats() -> GetStatsStmt {
    GetStatsStmt(crate::client::async_::Stmt::new(
        "SELECT (SELECT COUNT(id) FROM appointments WHERE status = 'on_process'::appointment_status) AS on_process_appointments, (SELECT COUNT(id) FROM appointments WHERE status = 'approved'::appointment_status) AS approved_appointments, (SELECT COUNT(id) FROM appointments WHERE status = 'done'::appointment_status) AS done_appointments, (SELECT COUNT(id) FROM appointments WHERE status = 'rejected'::appointment_status) AS rejected_appointments",
    ))
}
pub struct GetStatsStmt(crate::client::async_::Stmt);
impl GetStatsStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> AppointmentsStatsQuery<'c, 'a, 's, C, AppointmentsStats, 0> {
        AppointmentsStatsQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<AppointmentsStats, tokio_postgres::Error> {
                    Ok(AppointmentsStats {
                        on_process_appointments: row.try_get(0)?,
                        approved_appointments: row.try_get(1)?,
                        done_appointments: row.try_get(2)?,
                        rejected_appointments: row.try_get(3)?,
                    })
                },
            mapper: |it| AppointmentsStats::from(it),
        }
    }
}
