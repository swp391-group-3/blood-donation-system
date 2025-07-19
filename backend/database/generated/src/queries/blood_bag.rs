// This file was generated with `clorinde`. Do not modify.

#[derive(Debug)]
pub struct GetAllParams<T1: crate::StringSql> {
    pub component: Option<ctypes::BloodComponent>,
    pub blood_group: Option<ctypes::BloodGroup>,
    pub mode: T1,
    pub page_size: i32,
    pub page_index: i32,
}
#[derive(Clone, Copy, Debug)]
pub struct CreateParams {
    pub donation_id: uuid::Uuid,
    pub component: ctypes::BloodComponent,
    pub amount: i32,
    pub expired_time: chrono::DateTime<chrono::FixedOffset>,
}
#[derive(Clone, Copy, Debug)]
pub struct UpdateParams {
    pub component: Option<ctypes::BloodComponent>,
    pub amount: Option<i32>,
    pub expired_time: Option<chrono::DateTime<chrono::FixedOffset>>,
    pub id: uuid::Uuid,
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, Copy, utoipa::ToSchema)]
pub struct BloodBag {
    pub id: uuid::Uuid,
    pub donation_id: uuid::Uuid,
    pub component: ctypes::BloodComponent,
    pub is_used: bool,
    pub amount: i32,
    pub expired_time: chrono::DateTime<chrono::FixedOffset>,
    pub blood_group: ctypes::BloodGroup,
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, Copy, utoipa::ToSchema)]
pub struct BloodStorageStats {
    pub total_bags: i64,
    pub available_bags: i64,
    pub expiring_bags: i64,
    pub expired_bags: i64,
}
use crate::client::async_::GenericClient;
use futures::{self, StreamExt, TryStreamExt};
pub struct BloodBagQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<BloodBag, tokio_postgres::Error>,
    mapper: fn(BloodBag) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> BloodBagQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(BloodBag) -> R) -> BloodBagQuery<'c, 'a, 's, C, R, N> {
        BloodBagQuery {
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
pub struct BloodStorageStatsQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<BloodStorageStats, tokio_postgres::Error>,
    mapper: fn(BloodStorageStats) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> BloodStorageStatsQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(
        self,
        mapper: fn(BloodStorageStats) -> R,
    ) -> BloodStorageStatsQuery<'c, 'a, 's, C, R, N> {
        BloodStorageStatsQuery {
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
pub fn get() -> GetStmt {
    GetStmt(crate::client::async_::Stmt::new(
        "SELECT *, ( SELECT blood_group FROM accounts WHERE id = ( SELECT donor_id FROM appointments WHERE id = ( SELECT appointment_id FROM donations WHERE id = blood_bags.donation_id ) ) ) AS blood_group FROM blood_bags WHERE id = $1",
    ))
}
pub struct GetStmt(crate::client::async_::Stmt);
impl GetStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        id: &'a uuid::Uuid,
    ) -> BloodBagQuery<'c, 'a, 's, C, BloodBag, 1> {
        BloodBagQuery {
            client,
            params: [id],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<BloodBag, tokio_postgres::Error> {
                Ok(BloodBag {
                    id: row.try_get(0)?,
                    donation_id: row.try_get(1)?,
                    component: row.try_get(2)?,
                    is_used: row.try_get(3)?,
                    amount: row.try_get(4)?,
                    expired_time: row.try_get(5)?,
                    blood_group: row.try_get(6)?,
                })
            },
            mapper: |it| BloodBag::from(it),
        }
    }
}
pub fn get_all_scheduler() -> GetAllSchedulerStmt {
    GetAllSchedulerStmt(crate::client::async_::Stmt::new(
        "SELECT *, ( SELECT blood_group FROM accounts WHERE id = ( SELECT donor_id FROM appointments WHERE id = ( SELECT appointment_id FROM donations WHERE id = blood_bags.donation_id ) ) ) AS blood_group FROM blood_bags WHERE is_used = false",
    ))
}
pub struct GetAllSchedulerStmt(crate::client::async_::Stmt);
impl GetAllSchedulerStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> BloodBagQuery<'c, 'a, 's, C, BloodBag, 0> {
        BloodBagQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<BloodBag, tokio_postgres::Error> {
                Ok(BloodBag {
                    id: row.try_get(0)?,
                    donation_id: row.try_get(1)?,
                    component: row.try_get(2)?,
                    is_used: row.try_get(3)?,
                    amount: row.try_get(4)?,
                    expired_time: row.try_get(5)?,
                    blood_group: row.try_get(6)?,
                })
            },
            mapper: |it| BloodBag::from(it),
        }
    }
}
pub fn get_all() -> GetAllStmt {
    GetAllStmt(crate::client::async_::Stmt::new(
        "SELECT *, ( SELECT blood_group FROM accounts WHERE id = ( SELECT donor_id FROM appointments WHERE id = ( SELECT appointment_id FROM donations WHERE id = blood_bags.donation_id ) ) ) AS blood_group FROM blood_bags WHERE ( $1::blood_component IS NULL OR component = $1 ) AND ( $2::blood_group IS NULL OR ( CASE $3 WHEN 'Exact' THEN ( SELECT blood_group FROM accounts WHERE id = ( SELECT donor_id FROM appointments WHERE id = ( SELECT appointment_id FROM donations WHERE id = blood_bags.donation_id ) ) ) = $2 WHEN 'Compatible' THEN ( SELECT blood_group FROM accounts WHERE id = ( SELECT donor_id FROM appointments WHERE id = ( SELECT appointment_id FROM donations WHERE id = blood_bags.donation_id ) ) ) = ANY ( CASE $2 WHEN 'a_plus'   THEN ARRAY['a_plus','a_minus','o_plus','o_minus']::blood_group[] WHEN 'a_minus'  THEN ARRAY['a_minus','o_minus']::blood_group[] WHEN 'b_plus'   THEN ARRAY['b_plus','b_minus','o_plus','o_minus']::blood_group[] WHEN 'b_minus'  THEN ARRAY['b_minus','o_minus']::blood_group[] WHEN 'ab_plus'  THEN ARRAY['a_plus','a_minus','b_plus','b_minus','ab_plus','ab_minus','o_plus','o_minus']::blood_group[] WHEN 'ab_minus' THEN ARRAY['ab_minus','a_minus','b_minus','o_minus']::blood_group[] WHEN 'o_plus'   THEN ARRAY['o_plus','o_minus']::blood_group[] WHEN 'o_minus'  THEN ARRAY['o_minus']::blood_group[] END ) END ) ) AND is_used = false ORDER BY expired_time ASC LIMIT $4::int OFFSET $4::int * $5::int",
    ))
}
pub struct GetAllStmt(crate::client::async_::Stmt);
impl GetAllStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        component: &'a Option<ctypes::BloodComponent>,
        blood_group: &'a Option<ctypes::BloodGroup>,
        mode: &'a T1,
        page_size: &'a i32,
        page_index: &'a i32,
    ) -> BloodBagQuery<'c, 'a, 's, C, BloodBag, 5> {
        BloodBagQuery {
            client,
            params: [component, blood_group, mode, page_size, page_index],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<BloodBag, tokio_postgres::Error> {
                Ok(BloodBag {
                    id: row.try_get(0)?,
                    donation_id: row.try_get(1)?,
                    component: row.try_get(2)?,
                    is_used: row.try_get(3)?,
                    amount: row.try_get(4)?,
                    expired_time: row.try_get(5)?,
                    blood_group: row.try_get(6)?,
                })
            },
            mapper: |it| BloodBag::from(it),
        }
    }
}
impl<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>
    crate::client::async_::Params<
        'c,
        'a,
        's,
        GetAllParams<T1>,
        BloodBagQuery<'c, 'a, 's, C, BloodBag, 5>,
        C,
    > for GetAllStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a GetAllParams<T1>,
    ) -> BloodBagQuery<'c, 'a, 's, C, BloodBag, 5> {
        self.bind(
            client,
            &params.component,
            &params.blood_group,
            &params.mode,
            &params.page_size,
            &params.page_index,
        )
    }
}
pub fn create() -> CreateStmt {
    CreateStmt(crate::client::async_::Stmt::new(
        "INSERT INTO blood_bags ( donation_id, component, amount, expired_time ) VALUES ( $1, $2, $3, $4 ) RETURNING id",
    ))
}
pub struct CreateStmt(crate::client::async_::Stmt);
impl CreateStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        donation_id: &'a uuid::Uuid,
        component: &'a ctypes::BloodComponent,
        amount: &'a i32,
        expired_time: &'a chrono::DateTime<chrono::FixedOffset>,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 4> {
        UuidUuidQuery {
            client,
            params: [donation_id, component, amount, expired_time],
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
        UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 4>,
        C,
    > for CreateStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a CreateParams,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 4> {
        self.bind(
            client,
            &params.donation_id,
            &params.component,
            &params.amount,
            &params.expired_time,
        )
    }
}
pub fn delete() -> DeleteStmt {
    DeleteStmt(crate::client::async_::Stmt::new(
        "UPDATE blood_bags SET is_used = true WHERE id = $1",
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
        "UPDATE blood_bags SET component = COALESCE($1, component), amount = COALESCE($2, amount), expired_time = COALESCE($3, expired_time) WHERE id = $4",
    ))
}
pub struct UpdateStmt(crate::client::async_::Stmt);
impl UpdateStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        component: &'a Option<ctypes::BloodComponent>,
        amount: &'a Option<i32>,
        expired_time: &'a Option<chrono::DateTime<chrono::FixedOffset>>,
        id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client
            .execute(stmt, &[component, amount, expired_time, id])
            .await
    }
}
impl<'a, C: GenericClient + Send + Sync>
    crate::client::async_::Params<
        'a,
        'a,
        'a,
        UpdateParams,
        std::pin::Pin<
            Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
        >,
        C,
    > for UpdateStmt
{
    fn params(
        &'a mut self,
        client: &'a C,
        params: &'a UpdateParams,
    ) -> std::pin::Pin<
        Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
    > {
        Box::pin(self.bind(
            client,
            &params.component,
            &params.amount,
            &params.expired_time,
            &params.id,
        ))
    }
}
pub fn get_stats() -> GetStatsStmt {
    GetStatsStmt(crate::client::async_::Stmt::new(
        "SELECT (SELECT COUNT(id) FROM blood_bags) AS total_bags, (SELECT COUNT(id) FROM blood_bags WHERE is_used = false) AS available_bags, (SELECT COUNT(id) FROM blood_bags WHERE is_used = false AND expired_time > NOW() AND expired_time <= NOW() + INTERVAL '7 day') AS expiring_bags, (SELECT COUNT(id) FROM blood_bags WHERE is_used = false AND expired_time <= NOW()) AS expired_bags",
    ))
}
pub struct GetStatsStmt(crate::client::async_::Stmt);
impl GetStatsStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> BloodStorageStatsQuery<'c, 'a, 's, C, BloodStorageStats, 0> {
        BloodStorageStatsQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<BloodStorageStats, tokio_postgres::Error> {
                    Ok(BloodStorageStats {
                        total_bags: row.try_get(0)?,
                        available_bags: row.try_get(1)?,
                        expiring_bags: row.try_get(2)?,
                        expired_bags: row.try_get(3)?,
                    })
                },
            mapper: |it| BloodStorageStats::from(it),
        }
    }
}
