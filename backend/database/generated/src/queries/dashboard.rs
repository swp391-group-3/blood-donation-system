// This file was generated with `clorinde`. Do not modify.

#[derive(serde::Serialize, Debug, Clone, PartialEq, Copy, utoipa::ToSchema)]
pub struct GetStats {
    pub total_users: i64,
    pub total_donations: i64,
    pub active_blood_requests: i64,
    pub available_blood_bags: i64,
}
use crate::client::async_::GenericClient;
use futures::{self, StreamExt, TryStreamExt};
pub struct GetStatsQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<GetStats, tokio_postgres::Error>,
    mapper: fn(GetStats) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> GetStatsQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(GetStats) -> R) -> GetStatsQuery<'c, 'a, 's, C, R, N> {
        GetStatsQuery {
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
pub struct ChronoDateTimechronoFixedOffsetQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(
        &tokio_postgres::Row,
    ) -> Result<chrono::DateTime<chrono::FixedOffset>, tokio_postgres::Error>,
    mapper: fn(chrono::DateTime<chrono::FixedOffset>) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> ChronoDateTimechronoFixedOffsetQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(
        self,
        mapper: fn(chrono::DateTime<chrono::FixedOffset>) -> R,
    ) -> ChronoDateTimechronoFixedOffsetQuery<'c, 'a, 's, C, R, N> {
        ChronoDateTimechronoFixedOffsetQuery {
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
    ) -> GetStatsQuery<'c, 'a, 's, C, GetStats, 0> {
        GetStatsQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<GetStats, tokio_postgres::Error> {
                Ok(GetStats {
                    total_users: row.try_get(0)?,
                    total_donations: row.try_get(1)?,
                    active_blood_requests: row.try_get(2)?,
                    available_blood_bags: row.try_get(3)?,
                })
            },
            mapper: |it| GetStats::from(it),
        }
    }
}
pub fn get_donation_trend() -> GetDonationTrendStmt {
    GetDonationTrendStmt(crate::client::async_::Stmt::new(
        "SELECT created_at FROM donations",
    ))
}
pub struct GetDonationTrendStmt(crate::client::async_::Stmt);
impl GetDonationTrendStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> ChronoDateTimechronoFixedOffsetQuery<'c, 'a, 's, C, chrono::DateTime<chrono::FixedOffset>, 0>
    {
        ChronoDateTimechronoFixedOffsetQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor: |row| Ok(row.try_get(0)?),
            mapper: |it| it,
        }
    }
}
pub fn get_request_trend() -> GetRequestTrendStmt {
    GetRequestTrendStmt(crate::client::async_::Stmt::new(
        "SELECT start_time FROM blood_requests",
    ))
}
pub struct GetRequestTrendStmt(crate::client::async_::Stmt);
impl GetRequestTrendStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> ChronoDateTimechronoFixedOffsetQuery<'c, 'a, 's, C, chrono::DateTime<chrono::FixedOffset>, 0>
    {
        ChronoDateTimechronoFixedOffsetQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor: |row| Ok(row.try_get(0)?),
            mapper: |it| it,
        }
    }
}
