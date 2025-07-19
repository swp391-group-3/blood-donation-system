// This file was generated with `clorinde`. Do not modify.

#[derive(serde::Serialize, Debug, Clone, PartialEq, Copy, utoipa::ToSchema)]
pub struct DashboardStats {
    pub total_users: i64,
    pub total_donations: i64,
    pub active_blood_requests: i64,
    pub available_blood_bags: i64,
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, Copy, utoipa::ToSchema)]
pub struct DonationTrends {
    pub created_at: chrono::DateTime<chrono::FixedOffset>,
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, Copy, utoipa::ToSchema)]
pub struct RequestTrends {
    pub start_time: chrono::DateTime<chrono::FixedOffset>,
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, Copy, utoipa::ToSchema)]
pub struct BloodGroupDistribution {
    pub blood_group: ctypes::BloodGroup,
}
use crate::client::async_::GenericClient;
use futures::{self, StreamExt, TryStreamExt};
pub struct DashboardStatsQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<DashboardStats, tokio_postgres::Error>,
    mapper: fn(DashboardStats) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> DashboardStatsQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(
        self,
        mapper: fn(DashboardStats) -> R,
    ) -> DashboardStatsQuery<'c, 'a, 's, C, R, N> {
        DashboardStatsQuery {
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
pub struct DonationTrendsQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<DonationTrends, tokio_postgres::Error>,
    mapper: fn(DonationTrends) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> DonationTrendsQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(
        self,
        mapper: fn(DonationTrends) -> R,
    ) -> DonationTrendsQuery<'c, 'a, 's, C, R, N> {
        DonationTrendsQuery {
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
pub struct RequestTrendsQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<RequestTrends, tokio_postgres::Error>,
    mapper: fn(RequestTrends) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> RequestTrendsQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(RequestTrends) -> R) -> RequestTrendsQuery<'c, 'a, 's, C, R, N> {
        RequestTrendsQuery {
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
pub struct BloodGroupDistributionQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<BloodGroupDistribution, tokio_postgres::Error>,
    mapper: fn(BloodGroupDistribution) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> BloodGroupDistributionQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(
        self,
        mapper: fn(BloodGroupDistribution) -> R,
    ) -> BloodGroupDistributionQuery<'c, 'a, 's, C, R, N> {
        BloodGroupDistributionQuery {
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
pub fn get_stats() -> GetStatsStmt {
    GetStatsStmt(crate::client::async_::Stmt::new(
        "SELECT (SELECT COUNT(id) FROM accounts) AS total_users, (SELECT COUNT(id) FROM donations) AS total_donations, (SELECT COUNT(id) FROM blood_requests WHERE now() < end_time AND is_active = true) AS active_blood_requests, (SELECT COUNT(id) FROM blood_bags WHERE is_used = false) AS available_blood_bags",
    ))
}
pub struct GetStatsStmt(crate::client::async_::Stmt);
impl GetStatsStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> DashboardStatsQuery<'c, 'a, 's, C, DashboardStats, 0> {
        DashboardStatsQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<DashboardStats, tokio_postgres::Error> {
                    Ok(DashboardStats {
                        total_users: row.try_get(0)?,
                        total_donations: row.try_get(1)?,
                        active_blood_requests: row.try_get(2)?,
                        available_blood_bags: row.try_get(3)?,
                    })
                },
            mapper: |it| DashboardStats::from(it),
        }
    }
}
pub fn get_donation_trends() -> GetDonationTrendsStmt {
    GetDonationTrendsStmt(crate::client::async_::Stmt::new(
        "SELECT created_at FROM donations",
    ))
}
pub struct GetDonationTrendsStmt(crate::client::async_::Stmt);
impl GetDonationTrendsStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> DonationTrendsQuery<'c, 'a, 's, C, DonationTrends, 0> {
        DonationTrendsQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<DonationTrends, tokio_postgres::Error> {
                    Ok(DonationTrends {
                        created_at: row.try_get(0)?,
                    })
                },
            mapper: |it| DonationTrends::from(it),
        }
    }
}
pub fn get_request_trends() -> GetRequestTrendsStmt {
    GetRequestTrendsStmt(crate::client::async_::Stmt::new(
        "SELECT start_time FROM blood_requests",
    ))
}
pub struct GetRequestTrendsStmt(crate::client::async_::Stmt);
impl GetRequestTrendsStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> RequestTrendsQuery<'c, 'a, 's, C, RequestTrends, 0> {
        RequestTrendsQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<RequestTrends, tokio_postgres::Error> {
                Ok(RequestTrends {
                    start_time: row.try_get(0)?,
                })
            },
            mapper: |it| RequestTrends::from(it),
        }
    }
}
pub fn get_blood_group_distribution() -> GetBloodGroupDistributionStmt {
    GetBloodGroupDistributionStmt(crate::client::async_::Stmt::new(
        "SELECT blood_group FROM accounts",
    ))
}
pub struct GetBloodGroupDistributionStmt(crate::client::async_::Stmt);
impl GetBloodGroupDistributionStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> BloodGroupDistributionQuery<'c, 'a, 's, C, BloodGroupDistribution, 0> {
        BloodGroupDistributionQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor: |
                row: &tokio_postgres::Row,
            | -> Result<BloodGroupDistribution, tokio_postgres::Error> {
                Ok(BloodGroupDistribution {
                    blood_group: row.try_get(0)?,
                })
            },
            mapper: |it| BloodGroupDistribution::from(it),
        }
    }
}
