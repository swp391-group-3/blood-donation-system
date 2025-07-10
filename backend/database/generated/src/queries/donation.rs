// This file was generated with `clorinde`. Do not modify.

#[derive(Clone, Copy, Debug)]
pub struct CreateParams {
    pub appointment_id: uuid::Uuid,
    pub r#type: ctypes::DonationType,
    pub amount: i32,
}
#[derive(Clone, Copy, Debug)]
pub struct UpdateParams {
    pub r#type: Option<ctypes::DonationType>,
    pub amount: Option<i32>,
    pub id: uuid::Uuid,
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, Copy, utoipa::ToSchema)]
pub struct Donation {
    pub id: uuid::Uuid,
    pub appointment_id: uuid::Uuid,
    pub r#type: ctypes::DonationType,
    pub amount: i32,
    pub created_at: chrono::DateTime<chrono::FixedOffset>,
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
pub struct DonationQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<Donation, tokio_postgres::Error>,
    mapper: fn(Donation) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> DonationQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(Donation) -> R) -> DonationQuery<'c, 'a, 's, C, R, N> {
        DonationQuery {
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
        "INSERT INTO donations(appointment_id, type, amount) VALUES ( $1, $2, $3 ) RETURNING id",
    ))
}
pub struct CreateStmt(crate::client::async_::Stmt);
impl CreateStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        appointment_id: &'a uuid::Uuid,
        r#type: &'a ctypes::DonationType,
        amount: &'a i32,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 3> {
        UuidUuidQuery {
            client,
            params: [appointment_id, r#type, amount],
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
        UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 3>,
        C,
    > for CreateStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a CreateParams,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 3> {
        self.bind(
            client,
            &params.appointment_id,
            &params.r#type,
            &params.amount,
        )
    }
}
pub fn get() -> GetStmt {
    GetStmt(crate::client::async_::Stmt::new(
        "SELECT * FROM donations WHERE id = $1",
    ))
}
pub struct GetStmt(crate::client::async_::Stmt);
impl GetStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        id: &'a uuid::Uuid,
    ) -> DonationQuery<'c, 'a, 's, C, Donation, 1> {
        DonationQuery {
            client,
            params: [id],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<Donation, tokio_postgres::Error> {
                Ok(Donation {
                    id: row.try_get(0)?,
                    appointment_id: row.try_get(1)?,
                    r#type: row.try_get(2)?,
                    amount: row.try_get(3)?,
                    created_at: row.try_get(4)?,
                })
            },
            mapper: |it| Donation::from(it),
        }
    }
}
pub fn get_by_appointment_id() -> GetByAppointmentIdStmt {
    GetByAppointmentIdStmt(crate::client::async_::Stmt::new(
        "SELECT * FROM donations WHERE appointment_id = $1",
    ))
}
pub struct GetByAppointmentIdStmt(crate::client::async_::Stmt);
impl GetByAppointmentIdStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        appointment_id: &'a uuid::Uuid,
    ) -> DonationQuery<'c, 'a, 's, C, Donation, 1> {
        DonationQuery {
            client,
            params: [appointment_id],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<Donation, tokio_postgres::Error> {
                Ok(Donation {
                    id: row.try_get(0)?,
                    appointment_id: row.try_get(1)?,
                    r#type: row.try_get(2)?,
                    amount: row.try_get(3)?,
                    created_at: row.try_get(4)?,
                })
            },
            mapper: |it| Donation::from(it),
        }
    }
}
pub fn get_all() -> GetAllStmt {
    GetAllStmt(crate::client::async_::Stmt::new(
        "SELECT id, appointment_id, type, amount, created_at FROM donations",
    ))
}
pub struct GetAllStmt(crate::client::async_::Stmt);
impl GetAllStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> DonationQuery<'c, 'a, 's, C, Donation, 0> {
        DonationQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<Donation, tokio_postgres::Error> {
                Ok(Donation {
                    id: row.try_get(0)?,
                    appointment_id: row.try_get(1)?,
                    r#type: row.try_get(2)?,
                    amount: row.try_get(3)?,
                    created_at: row.try_get(4)?,
                })
            },
            mapper: |it| Donation::from(it),
        }
    }
}
pub fn get_by_donor_id() -> GetByDonorIdStmt {
    GetByDonorIdStmt(crate::client::async_::Stmt::new(
        "SELECT id, appointment_id, type, amount, created_at FROM donations WHERE appointment_id IN (SELECT id FROM appointments WHERE donor_id = $1)",
    ))
}
pub struct GetByDonorIdStmt(crate::client::async_::Stmt);
impl GetByDonorIdStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        donor_id: &'a uuid::Uuid,
    ) -> DonationQuery<'c, 'a, 's, C, Donation, 1> {
        DonationQuery {
            client,
            params: [donor_id],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<Donation, tokio_postgres::Error> {
                Ok(Donation {
                    id: row.try_get(0)?,
                    appointment_id: row.try_get(1)?,
                    r#type: row.try_get(2)?,
                    amount: row.try_get(3)?,
                    created_at: row.try_get(4)?,
                })
            },
            mapper: |it| Donation::from(it),
        }
    }
}
pub fn update() -> UpdateStmt {
    UpdateStmt(crate::client::async_::Stmt::new(
        "UPDATE donations SET type = COALESCE($1, type), amount = COALESCE($2, amount) WHERE id = $3",
    ))
}
pub struct UpdateStmt(crate::client::async_::Stmt);
impl UpdateStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        r#type: &'a Option<ctypes::DonationType>,
        amount: &'a Option<i32>,
        id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client.execute(stmt, &[r#type, amount, id]).await
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
        Box::pin(self.bind(client, &params.r#type, &params.amount, &params.id))
    }
}
