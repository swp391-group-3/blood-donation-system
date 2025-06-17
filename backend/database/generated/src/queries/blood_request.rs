// This file was generated with `clorinde`. Do not modify.

#[derive(Debug)]
pub struct CreateParams<T1: crate::StringSql> {
    pub staff_id: uuid::Uuid,
    pub priority: ctypes::RequestPriority,
    pub title: T1,
    pub max_people: i32,
    pub start_time: crate::types::time::TimestampTz,
    pub end_time: crate::types::time::TimestampTz,
}
#[derive(Clone, Copy, Debug)]
pub struct AddBloodGroupParams {
    pub request_id: uuid::Uuid,
    pub blood_group: ctypes::BloodGroup,
}
#[derive(Debug)]
pub struct UpdateParams<T1: crate::StringSql> {
    pub priority: Option<ctypes::RequestPriority>,
    pub title: Option<T1>,
    pub max_people: Option<i32>,
    pub id: uuid::Uuid,
}
#[derive(Debug, Clone, PartialEq)]
pub struct GetAll {
    pub priority: ctypes::RequestPriority,
    pub title: String,
    pub blood_groups: Vec<ctypes::BloodGroup>,
    pub current_people: i64,
    pub max_people: i32,
    pub start_time: crate::types::time::TimestampTz,
    pub end_time: crate::types::time::TimestampTz,
}
pub struct GetAllBorrowed<'a> {
    pub priority: ctypes::RequestPriority,
    pub title: &'a str,
    pub blood_groups: crate::ArrayIterator<'a, ctypes::BloodGroup>,
    pub current_people: i64,
    pub max_people: i32,
    pub start_time: crate::types::time::TimestampTz,
    pub end_time: crate::types::time::TimestampTz,
}
impl<'a> From<GetAllBorrowed<'a>> for GetAll {
    fn from(
        GetAllBorrowed {
            priority,
            title,
            blood_groups,
            current_people,
            max_people,
            start_time,
            end_time,
        }: GetAllBorrowed<'a>,
    ) -> Self {
        Self {
            priority,
            title: title.into(),
            blood_groups: blood_groups.map(|v| v).collect(),
            current_people,
            max_people,
            start_time,
            end_time,
        }
    }
}
#[derive(Debug, Clone, PartialEq)]
pub struct GetByMemberId {
    pub priority: ctypes::RequestPriority,
    pub title: String,
    pub blood_groups: Vec<ctypes::BloodGroup>,
    pub current_people: i64,
    pub max_people: i32,
    pub start_time: crate::types::time::TimestampTz,
    pub end_time: crate::types::time::TimestampTz,
}
pub struct GetByMemberIdBorrowed<'a> {
    pub priority: ctypes::RequestPriority,
    pub title: &'a str,
    pub blood_groups: crate::ArrayIterator<'a, ctypes::BloodGroup>,
    pub current_people: i64,
    pub max_people: i32,
    pub start_time: crate::types::time::TimestampTz,
    pub end_time: crate::types::time::TimestampTz,
}
impl<'a> From<GetByMemberIdBorrowed<'a>> for GetByMemberId {
    fn from(
        GetByMemberIdBorrowed {
            priority,
            title,
            blood_groups,
            current_people,
            max_people,
            start_time,
            end_time,
        }: GetByMemberIdBorrowed<'a>,
    ) -> Self {
        Self {
            priority,
            title: title.into(),
            blood_groups: blood_groups.map(|v| v).collect(),
            current_people,
            max_people,
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
pub struct GetAllQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<GetAllBorrowed, tokio_postgres::Error>,
    mapper: fn(GetAllBorrowed) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> GetAllQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(GetAllBorrowed) -> R) -> GetAllQuery<'c, 'a, 's, C, R, N> {
        GetAllQuery {
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
        start_time: &'a crate::types::time::TimestampTz,
        end_time: &'a crate::types::time::TimestampTz,
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
pub fn get_all() -> GetAllStmt {
    GetAllStmt(crate::client::async_::Stmt::new(
        "SELECT priority, title, ( SELECT ARRAY( SELECT blood_group FROM request_blood_groups WHERE request_id = blood_requests.id ) ) AS blood_groups, ( SELECT COUNT(id) FROM appointments WHERE request_id = blood_requests.id ) as current_people, max_people, start_time, end_time FROM blood_requests WHERE now() < end_time AND is_active = true",
    ))
}
pub struct GetAllStmt(crate::client::async_::Stmt);
impl GetAllStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> GetAllQuery<'c, 'a, 's, C, GetAll, 0> {
        GetAllQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<GetAllBorrowed, tokio_postgres::Error> {
                    Ok(GetAllBorrowed {
                        priority: row.try_get(0)?,
                        title: row.try_get(1)?,
                        blood_groups: row.try_get(2)?,
                        current_people: row.try_get(3)?,
                        max_people: row.try_get(4)?,
                        start_time: row.try_get(5)?,
                        end_time: row.try_get(6)?,
                    })
                },
            mapper: |it| GetAll::from(it),
        }
    }
}
pub fn get_by_member_id() -> GetByMemberIdStmt {
    GetByMemberIdStmt(crate::client::async_::Stmt::new(
        "SELECT priority, title, ( SELECT ARRAY( SELECT blood_group FROM request_blood_groups WHERE request_id = blood_requests.id ) ) AS blood_groups, ( SELECT COUNT(id) FROM appointments WHERE request_id = blood_requests.id ) as current_people, max_people, start_time, end_time FROM blood_requests WHERE blood_requests.id IN ( SELECT request_id FROM appointments WHERE member_id = $1 )",
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
                        priority: row.try_get(0)?,
                        title: row.try_get(1)?,
                        blood_groups: row.try_get(2)?,
                        current_people: row.try_get(3)?,
                        max_people: row.try_get(4)?,
                        start_time: row.try_get(5)?,
                        end_time: row.try_get(6)?,
                    })
                },
            mapper: |it| GetByMemberId::from(it),
        }
    }
}
pub fn update() -> UpdateStmt {
    UpdateStmt(crate::client::async_::Stmt::new(
        "UPDATE blood_requests SET priority = COALESCE($1, priority), title = COALESCE($2, title), max_people = COALESCE($3, max_people) WHERE id = $4",
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
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client
            .execute(stmt, &[priority, title, max_people, id])
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
        ))
    }
}
pub fn delete() -> DeleteStmt {
    DeleteStmt(crate::client::async_::Stmt::new(
        "UPDATE blood_requests SET is_active = false WHERE id = $1",
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
