// This file was generated with `clorinde`. Do not modify.

#[derive(Debug)]
pub struct CreateParams<T1: crate::StringSql> {
    pub staff_id: uuid::Uuid,
    pub priority: ctypes::RequestPriority,
    pub title: T1,
    pub max_people: i32,
    pub start_time: chrono::DateTime<chrono::FixedOffset>,
    pub end_time: chrono::DateTime<chrono::FixedOffset>,
}
#[derive(Clone, Copy, Debug)]
pub struct AddBloodGroupParams {
    pub request_id: uuid::Uuid,
    pub blood_group: ctypes::BloodGroup,
}
#[derive(Clone, Copy, Debug)]
pub struct GetParams {
    pub account_id: uuid::Uuid,
    pub id: uuid::Uuid,
}
#[derive(Debug)]
pub struct CountParams<T1: crate::StringSql> {
    pub account_id: uuid::Uuid,
    pub query: Option<T1>,
    pub priority: Option<ctypes::RequestPriority>,
    pub blood_group: Option<ctypes::BloodGroup>,
}
#[derive(Debug)]
pub struct GetAllParams<T1: crate::StringSql> {
    pub account_id: uuid::Uuid,
    pub query: Option<T1>,
    pub priority: Option<ctypes::RequestPriority>,
    pub blood_group: Option<ctypes::BloodGroup>,
    pub page_size: i32,
    pub page_index: i32,
}
#[derive(Debug)]
pub struct UpdateParams<T1: crate::StringSql> {
    pub priority: Option<ctypes::RequestPriority>,
    pub title: Option<T1>,
    pub max_people: Option<i32>,
    pub id: uuid::Uuid,
    pub staff_id: uuid::Uuid,
}
#[derive(Clone, Copy, Debug)]
pub struct DeleteParams {
    pub id: uuid::Uuid,
    pub staff_id: uuid::Uuid,
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, utoipa::ToSchema)]
pub struct BloodRequest {
    pub id: uuid::Uuid,
    pub priority: ctypes::RequestPriority,
    pub title: String,
    pub max_people: i32,
    pub start_time: chrono::DateTime<chrono::FixedOffset>,
    pub end_time: chrono::DateTime<chrono::FixedOffset>,
    pub is_active: bool,
    pub created_at: chrono::DateTime<chrono::FixedOffset>,
    pub blood_groups: Vec<ctypes::BloodGroup>,
    pub current_people: i64,
    pub is_editable: bool,
}
pub struct BloodRequestBorrowed<'a> {
    pub id: uuid::Uuid,
    pub priority: ctypes::RequestPriority,
    pub title: &'a str,
    pub max_people: i32,
    pub start_time: chrono::DateTime<chrono::FixedOffset>,
    pub end_time: chrono::DateTime<chrono::FixedOffset>,
    pub is_active: bool,
    pub created_at: chrono::DateTime<chrono::FixedOffset>,
    pub blood_groups: crate::ArrayIterator<'a, ctypes::BloodGroup>,
    pub current_people: i64,
    pub is_editable: bool,
}
impl<'a> From<BloodRequestBorrowed<'a>> for BloodRequest {
    fn from(
        BloodRequestBorrowed {
            id,
            priority,
            title,
            max_people,
            start_time,
            end_time,
            is_active,
            created_at,
            blood_groups,
            current_people,
            is_editable,
        }: BloodRequestBorrowed<'a>,
    ) -> Self {
        Self {
            id,
            priority,
            title: title.into(),
            max_people,
            start_time,
            end_time,
            is_active,
            created_at,
            blood_groups: blood_groups.map(|v| v).collect(),
            current_people,
            is_editable,
        }
    }
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, Copy, utoipa::ToSchema)]
pub struct BloodRequestsStats {
    pub total_requests: i64,
    pub urgent_requests: i64,
    pub donors_needed: i64,
    pub recommended_requests: i64,
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
pub struct BloodRequestQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<BloodRequestBorrowed, tokio_postgres::Error>,
    mapper: fn(BloodRequestBorrowed) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> BloodRequestQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(
        self,
        mapper: fn(BloodRequestBorrowed) -> R,
    ) -> BloodRequestQuery<'c, 'a, 's, C, R, N> {
        BloodRequestQuery {
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
pub struct BloodRequestsStatsQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<BloodRequestsStats, tokio_postgres::Error>,
    mapper: fn(BloodRequestsStats) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> BloodRequestsStatsQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(
        self,
        mapper: fn(BloodRequestsStats) -> R,
    ) -> BloodRequestsStatsQuery<'c, 'a, 's, C, R, N> {
        BloodRequestsStatsQuery {
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
        "INSERT INTO blood_requests( staff_id, priority, title, max_people, start_time, end_time ) VALUES ( $1, $2, $3, $4, $5, $6 ) RETURNING id",
    ))
}
pub struct CreateStmt(crate::client::async_::Stmt);
impl CreateStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        staff_id: &'a uuid::Uuid,
        priority: &'a ctypes::RequestPriority,
        title: &'a T1,
        max_people: &'a i32,
        start_time: &'a chrono::DateTime<chrono::FixedOffset>,
        end_time: &'a chrono::DateTime<chrono::FixedOffset>,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 6> {
        UuidUuidQuery {
            client,
            params: [staff_id, priority, title, max_people, start_time, end_time],
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
        UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 6>,
        C,
    > for CreateStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a CreateParams<T1>,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 6> {
        self.bind(
            client,
            &params.staff_id,
            &params.priority,
            &params.title,
            &params.max_people,
            &params.start_time,
            &params.end_time,
        )
    }
}
pub fn add_blood_group() -> AddBloodGroupStmt {
    AddBloodGroupStmt(crate::client::async_::Stmt::new(
        "INSERT INTO request_blood_groups( request_id, blood_group ) VALUES ( $1, $2 )",
    ))
}
pub struct AddBloodGroupStmt(crate::client::async_::Stmt);
impl AddBloodGroupStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        request_id: &'a uuid::Uuid,
        blood_group: &'a ctypes::BloodGroup,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client.execute(stmt, &[request_id, blood_group]).await
    }
}
impl<'a, C: GenericClient + Send + Sync>
    crate::client::async_::Params<
        'a,
        'a,
        'a,
        AddBloodGroupParams,
        std::pin::Pin<
            Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
        >,
        C,
    > for AddBloodGroupStmt
{
    fn params(
        &'a mut self,
        client: &'a C,
        params: &'a AddBloodGroupParams,
    ) -> std::pin::Pin<
        Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
    > {
        Box::pin(self.bind(client, &params.request_id, &params.blood_group))
    }
}
pub fn get() -> GetStmt {
    GetStmt(crate::client::async_::Stmt::new(
        "SELECT id, priority, title, max_people, start_time, end_time, is_active, created_at, ( SELECT ARRAY( SELECT blood_group FROM request_blood_groups WHERE request_id = blood_requests.id ) ) AS blood_groups, ( SELECT COUNT(id) FROM appointments WHERE request_id = blood_requests.id ) as current_people, (staff_id = $1) as is_editable FROM blood_requests WHERE id = $2",
    ))
}
pub struct GetStmt(crate::client::async_::Stmt);
impl GetStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        account_id: &'a uuid::Uuid,
        id: &'a uuid::Uuid,
    ) -> BloodRequestQuery<'c, 'a, 's, C, BloodRequest, 2> {
        BloodRequestQuery {
            client,
            params: [account_id, id],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<BloodRequestBorrowed, tokio_postgres::Error> {
                    Ok(BloodRequestBorrowed {
                        id: row.try_get(0)?,
                        priority: row.try_get(1)?,
                        title: row.try_get(2)?,
                        max_people: row.try_get(3)?,
                        start_time: row.try_get(4)?,
                        end_time: row.try_get(5)?,
                        is_active: row.try_get(6)?,
                        created_at: row.try_get(7)?,
                        blood_groups: row.try_get(8)?,
                        current_people: row.try_get(9)?,
                        is_editable: row.try_get(10)?,
                    })
                },
            mapper: |it| BloodRequest::from(it),
        }
    }
}
impl<'c, 'a, 's, C: GenericClient>
    crate::client::async_::Params<
        'c,
        'a,
        's,
        GetParams,
        BloodRequestQuery<'c, 'a, 's, C, BloodRequest, 2>,
        C,
    > for GetStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a GetParams,
    ) -> BloodRequestQuery<'c, 'a, 's, C, BloodRequest, 2> {
        self.bind(client, &params.account_id, &params.id)
    }
}
pub fn count() -> CountStmt {
    CountStmt(crate::client::async_::Stmt::new(
        "SELECT COUNT(*) FROM blood_requests WHERE ( $1 = '00000000-0000-0000-0000-000000000000'::uuid OR ( SELECT role FROM accounts WHERE id = $1 ) != 'donor'::role OR EXISTS ( SELECT 1 FROM request_blood_groups WHERE request_id = blood_requests.id AND blood_group = ANY ( CASE ( SELECT blood_group FROM accounts WHERE id = $1 ) WHEN 'o_minus'  THEN ARRAY['a_plus','a_minus','b_plus','b_minus','ab_plus','ab_minus','o_plus','o_minus']::blood_group[] WHEN 'o_plus'   THEN ARRAY['a_plus','b_plus','ab_plus','o_plus']::blood_group[] WHEN 'a_minus'  THEN ARRAY['a_plus','a_minus','ab_plus','ab_minus']::blood_group[] WHEN 'a_plus'   THEN ARRAY['a_plus','ab_plus']::blood_group[] WHEN 'b_minus'  THEN ARRAY['b_plus','b_minus','ab_plus','ab_minus']::blood_group[] WHEN 'b_plus'   THEN ARRAY['b_plus','ab_plus']::blood_group[] WHEN 'ab_minus' THEN ARRAY['ab_plus','ab_minus']::blood_group[] WHEN 'ab_plus'  THEN ARRAY['ab_plus']::blood_group[] END ) ) ) AND ( $2::text IS NULL OR (title LIKE '%' || $2 || '%' ) ) AND ( $3::request_priority IS NULL OR priority = $3 ) AND ( $4::blood_group IS NULL OR EXISTS ( SELECT 1 FROM request_blood_groups WHERE request_id = blood_requests.id AND blood_group = $4 ) ) AND now() < end_time AND is_active = true",
    ))
}
pub struct CountStmt(crate::client::async_::Stmt);
impl CountStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        account_id: &'a uuid::Uuid,
        query: &'a Option<T1>,
        priority: &'a Option<ctypes::RequestPriority>,
        blood_group: &'a Option<ctypes::BloodGroup>,
    ) -> I64Query<'c, 'a, 's, C, i64, 4> {
        I64Query {
            client,
            params: [account_id, query, priority, blood_group],
            stmt: &mut self.0,
            extractor: |row| Ok(row.try_get(0)?),
            mapper: |it| it,
        }
    }
}
impl<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>
    crate::client::async_::Params<'c, 'a, 's, CountParams<T1>, I64Query<'c, 'a, 's, C, i64, 4>, C>
    for CountStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a CountParams<T1>,
    ) -> I64Query<'c, 'a, 's, C, i64, 4> {
        self.bind(
            client,
            &params.account_id,
            &params.query,
            &params.priority,
            &params.blood_group,
        )
    }
}
pub fn get_all() -> GetAllStmt {
    GetAllStmt(crate::client::async_::Stmt::new(
        "SELECT id, priority, title, max_people, start_time, end_time, is_active, created_at, ( SELECT ARRAY( SELECT blood_group FROM request_blood_groups WHERE request_id = blood_requests.id ) ) AS blood_groups, ( SELECT COUNT(id) FROM appointments WHERE request_id = blood_requests.id ) as current_people, (staff_id = $1) as is_editable FROM blood_requests WHERE ( $1 = '00000000-0000-0000-0000-000000000000' OR ( SELECT role FROM accounts WHERE id = $1 ) != 'donor'::role OR EXISTS ( SELECT 1 FROM request_blood_groups WHERE request_id = blood_requests.id AND blood_group = ANY ( CASE ( SELECT blood_group FROM accounts WHERE id = $1 ) WHEN 'o_minus'  THEN ARRAY['a_plus','a_minus','b_plus','b_minus','ab_plus','ab_minus','o_plus','o_minus']::blood_group[] WHEN 'o_plus'   THEN ARRAY['a_plus','b_plus','ab_plus','o_plus']::blood_group[] WHEN 'a_minus'  THEN ARRAY['a_plus','a_minus','ab_plus','ab_minus']::blood_group[] WHEN 'a_plus'   THEN ARRAY['a_plus','ab_plus']::blood_group[] WHEN 'b_minus'  THEN ARRAY['b_plus','b_minus','ab_plus','ab_minus']::blood_group[] WHEN 'b_plus'   THEN ARRAY['b_plus','ab_plus']::blood_group[] WHEN 'ab_minus' THEN ARRAY['ab_plus','ab_minus']::blood_group[] WHEN 'ab_plus'  THEN ARRAY['ab_plus']::blood_group[] END ) ) ) AND ( $2::text IS NULL OR (title LIKE '%' || $2 || '%' ) ) AND ( $3::request_priority IS NULL OR priority = $3 ) AND ( $4::blood_group IS NULL OR EXISTS ( SELECT 1 FROM request_blood_groups WHERE request_id = blood_requests.id AND blood_group = $4 ) ) AND now() < end_time AND is_active = true LIMIT $5::int OFFSET $5::int * $6::int",
    ))
}
pub struct GetAllStmt(crate::client::async_::Stmt);
impl GetAllStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        account_id: &'a uuid::Uuid,
        query: &'a Option<T1>,
        priority: &'a Option<ctypes::RequestPriority>,
        blood_group: &'a Option<ctypes::BloodGroup>,
        page_size: &'a i32,
        page_index: &'a i32,
    ) -> BloodRequestQuery<'c, 'a, 's, C, BloodRequest, 6> {
        BloodRequestQuery {
            client,
            params: [
                account_id,
                query,
                priority,
                blood_group,
                page_size,
                page_index,
            ],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<BloodRequestBorrowed, tokio_postgres::Error> {
                    Ok(BloodRequestBorrowed {
                        id: row.try_get(0)?,
                        priority: row.try_get(1)?,
                        title: row.try_get(2)?,
                        max_people: row.try_get(3)?,
                        start_time: row.try_get(4)?,
                        end_time: row.try_get(5)?,
                        is_active: row.try_get(6)?,
                        created_at: row.try_get(7)?,
                        blood_groups: row.try_get(8)?,
                        current_people: row.try_get(9)?,
                        is_editable: row.try_get(10)?,
                    })
                },
            mapper: |it| BloodRequest::from(it),
        }
    }
}
impl<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>
    crate::client::async_::Params<
        'c,
        'a,
        's,
        GetAllParams<T1>,
        BloodRequestQuery<'c, 'a, 's, C, BloodRequest, 6>,
        C,
    > for GetAllStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a GetAllParams<T1>,
    ) -> BloodRequestQuery<'c, 'a, 's, C, BloodRequest, 6> {
        self.bind(
            client,
            &params.account_id,
            &params.query,
            &params.priority,
            &params.blood_group,
            &params.page_size,
            &params.page_index,
        )
    }
}
pub fn update() -> UpdateStmt {
    UpdateStmt(crate::client::async_::Stmt::new(
        "UPDATE blood_requests SET priority = COALESCE($1, priority), title = COALESCE($2, title), max_people = COALESCE($3, max_people) WHERE id = $4 AND staff_id = $5",
    ))
}
pub struct UpdateStmt(crate::client::async_::Stmt);
impl UpdateStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        priority: &'a Option<ctypes::RequestPriority>,
        title: &'a Option<T1>,
        max_people: &'a Option<i32>,
        id: &'a uuid::Uuid,
        staff_id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client
            .execute(stmt, &[priority, title, max_people, id, staff_id])
            .await
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
        Box::pin(self.bind(
            client,
            &params.priority,
            &params.title,
            &params.max_people,
            &params.id,
            &params.staff_id,
        ))
    }
}
pub fn delete() -> DeleteStmt {
    DeleteStmt(crate::client::async_::Stmt::new(
        "UPDATE blood_requests SET is_active = false WHERE id = $1 AND staff_id = $2",
    ))
}
pub struct DeleteStmt(crate::client::async_::Stmt);
impl DeleteStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        id: &'a uuid::Uuid,
        staff_id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client.execute(stmt, &[id, staff_id]).await
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
        Box::pin(self.bind(client, &params.id, &params.staff_id))
    }
}
pub fn get_stats() -> GetStatsStmt {
    GetStatsStmt(crate::client::async_::Stmt::new(
        "SELECT ( SELECT COUNT(id) FROM blood_requests WHERE is_active = true AND now() < end_time ) AS total_requests, ( SELECT COUNT(id) FROM blood_requests WHERE is_active = true AND now() < end_time AND priority = 'high'::request_priority ) AS urgent_requests, ( SELECT CAST( COALESCE(SUM(max_people - ( SELECT COUNT(id) FROM appointments WHERE request_id = blood_requests.id )), 0) AS BIGINT ) FROM blood_requests WHERE is_active = true AND now() < end_time ) AS donors_needed, ( SELECT COUNT(id) FROM blood_requests WHERE is_active = true AND now() < end_time AND EXISTS ( SELECT 1 FROM request_blood_groups WHERE request_id = blood_requests.id AND blood_group = ANY ( CASE ( SELECT blood_group FROM accounts WHERE id = $1 ) WHEN 'o_minus'  THEN ARRAY['o_minus', 'o_plus', 'a_minus', 'a_plus', 'b_minus', 'b_plus', 'ab_minus', 'ab_plus']::blood_group[] WHEN 'o_plus'   THEN ARRAY['o_plus', 'a_plus', 'b_plus', 'ab_plus']::blood_group[] WHEN 'a_minus'  THEN ARRAY['a_minus', 'a_plus', 'ab_minus', 'ab_plus']::blood_group[] WHEN 'a_plus'   THEN ARRAY['a_plus', 'ab_plus']::blood_group[] WHEN 'b_minus'  THEN ARRAY['b_minus', 'b_plus', 'ab_minus', 'ab_plus']::blood_group[] WHEN 'b_plus'   THEN ARRAY['b_plus', 'ab_plus']::blood_group[] WHEN 'ab_minus' THEN ARRAY['ab_minus', 'ab_plus']::blood_group[] WHEN 'ab_plus'  THEN ARRAY['ab_plus']::blood_group[] END ) ) ) AS recommended_requests",
    ))
}
pub struct GetStatsStmt(crate::client::async_::Stmt);
impl GetStatsStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        account_id: &'a uuid::Uuid,
    ) -> BloodRequestsStatsQuery<'c, 'a, 's, C, BloodRequestsStats, 1> {
        BloodRequestsStatsQuery {
            client,
            params: [account_id],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<BloodRequestsStats, tokio_postgres::Error> {
                    Ok(BloodRequestsStats {
                        total_requests: row.try_get(0)?,
                        urgent_requests: row.try_get(1)?,
                        donors_needed: row.try_get(2)?,
                        recommended_requests: row.try_get(3)?,
                    })
                },
            mapper: |it| BloodRequestsStats::from(it),
        }
    }
}
