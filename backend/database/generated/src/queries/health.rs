// This file was generated with `clorinde`. Do not modify.

#[derive(Debug)]
pub struct CreateParams<T1: crate::StringSql> {
    pub appointment_id: uuid::Uuid,
    pub temperature: f32,
    pub weight: f32,
    pub upper_blood_pressure: i32,
    pub lower_blood_pressure: i32,
    pub heart_pulse: i32,
    pub hemoglobin: f32,
    pub is_good_health: bool,
    pub note: Option<T1>,
}
#[derive(Debug)]
pub struct UpdateParams<T1: crate::StringSql> {
    pub temperature: Option<f32>,
    pub weight: Option<f32>,
    pub upper_blood_pressure: Option<i32>,
    pub lower_blood_pressure: Option<i32>,
    pub heart_pulse: Option<i32>,
    pub hemoglobin: Option<f32>,
    pub is_good_health: Option<bool>,
    pub note: Option<T1>,
    pub id: uuid::Uuid,
}
#[derive(Debug, Clone, PartialEq)]
pub struct GetByAppointmentId {
    pub id: uuid::Uuid,
    pub appointment_id: uuid::Uuid,
    pub temperature: f32,
    pub weight: f32,
    pub upper_blood_pressure: i32,
    pub lower_blood_pressure: i32,
    pub heart_pulse: i32,
    pub hemoglobin: f32,
    pub is_good_health: bool,
    pub note: String,
    pub created_at: crate::types::time::TimestampTz,
}
pub struct GetByAppointmentIdBorrowed<'a> {
    pub id: uuid::Uuid,
    pub appointment_id: uuid::Uuid,
    pub temperature: f32,
    pub weight: f32,
    pub upper_blood_pressure: i32,
    pub lower_blood_pressure: i32,
    pub heart_pulse: i32,
    pub hemoglobin: f32,
    pub is_good_health: bool,
    pub note: &'a str,
    pub created_at: crate::types::time::TimestampTz,
}
impl<'a> From<GetByAppointmentIdBorrowed<'a>> for GetByAppointmentId {
    fn from(
        GetByAppointmentIdBorrowed {
            id,
            appointment_id,
            temperature,
            weight,
            upper_blood_pressure,
            lower_blood_pressure,
            heart_pulse,
            hemoglobin,
            is_good_health,
            note,
            created_at,
        }: GetByAppointmentIdBorrowed<'a>,
    ) -> Self {
        Self {
            id,
            appointment_id,
            temperature,
            weight,
            upper_blood_pressure,
            lower_blood_pressure,
            heart_pulse,
            hemoglobin,
            is_good_health,
            note: note.into(),
            created_at,
        }
    }
}
#[derive(Debug, Clone, PartialEq)]
pub struct GetByMemberId {
    pub id: uuid::Uuid,
    pub appointment_id: uuid::Uuid,
    pub temperature: f32,
    pub weight: f32,
    pub upper_blood_pressure: i32,
    pub lower_blood_pressure: i32,
    pub heart_pulse: i32,
    pub hemoglobin: f32,
    pub is_good_health: bool,
    pub note: String,
    pub created_at: crate::types::time::TimestampTz,
}
pub struct GetByMemberIdBorrowed<'a> {
    pub id: uuid::Uuid,
    pub appointment_id: uuid::Uuid,
    pub temperature: f32,
    pub weight: f32,
    pub upper_blood_pressure: i32,
    pub lower_blood_pressure: i32,
    pub heart_pulse: i32,
    pub hemoglobin: f32,
    pub is_good_health: bool,
    pub note: &'a str,
    pub created_at: crate::types::time::TimestampTz,
}
impl<'a> From<GetByMemberIdBorrowed<'a>> for GetByMemberId {
    fn from(
        GetByMemberIdBorrowed {
            id,
            appointment_id,
            temperature,
            weight,
            upper_blood_pressure,
            lower_blood_pressure,
            heart_pulse,
            hemoglobin,
            is_good_health,
            note,
            created_at,
        }: GetByMemberIdBorrowed<'a>,
    ) -> Self {
        Self {
            id,
            appointment_id,
            temperature,
            weight,
            upper_blood_pressure,
            lower_blood_pressure,
            heart_pulse,
            hemoglobin,
            is_good_health,
            note: note.into(),
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
pub struct GetByAppointmentIdQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor:
        fn(&tokio_postgres::Row) -> Result<GetByAppointmentIdBorrowed, tokio_postgres::Error>,
    mapper: fn(GetByAppointmentIdBorrowed) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> GetByAppointmentIdQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(
        self,
        mapper: fn(GetByAppointmentIdBorrowed) -> R,
    ) -> GetByAppointmentIdQuery<'c, 'a, 's, C, R, N> {
        GetByAppointmentIdQuery {
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
        "INSERT INTO healths( appointment_id, temperature, weight, upper_blood_pressure, lower_blood_pressure, heart_pulse, hemoglobin, is_good_health, note ) VALUES( $1, $2, $3, $4, $5, $6, $7, $8, $9 ) RETURNING id",
    ))
}
pub struct CreateStmt(crate::client::async_::Stmt);
impl CreateStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        appointment_id: &'a uuid::Uuid,
        temperature: &'a f32,
        weight: &'a f32,
        upper_blood_pressure: &'a i32,
        lower_blood_pressure: &'a i32,
        heart_pulse: &'a i32,
        hemoglobin: &'a f32,
        is_good_health: &'a bool,
        note: &'a Option<T1>,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 9> {
        UuidUuidQuery {
            client,
            params: [
                appointment_id,
                temperature,
                weight,
                upper_blood_pressure,
                lower_blood_pressure,
                heart_pulse,
                hemoglobin,
                is_good_health,
                note,
            ],
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
        UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 9>,
        C,
    > for CreateStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a CreateParams<T1>,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 9> {
        self.bind(
            client,
            &params.appointment_id,
            &params.temperature,
            &params.weight,
            &params.upper_blood_pressure,
            &params.lower_blood_pressure,
            &params.heart_pulse,
            &params.hemoglobin,
            &params.is_good_health,
            &params.note,
        )
    }
}
pub fn get_by_appointment_id() -> GetByAppointmentIdStmt {
    GetByAppointmentIdStmt(crate::client::async_::Stmt::new(
        "SELECT * FROM healths WHERE appointment_id = $1",
    ))
}
pub struct GetByAppointmentIdStmt(crate::client::async_::Stmt);
impl GetByAppointmentIdStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        appointment_id: &'a uuid::Uuid,
    ) -> GetByAppointmentIdQuery<'c, 'a, 's, C, GetByAppointmentId, 1> {
        GetByAppointmentIdQuery {
            client,
            params: [appointment_id],
            stmt: &mut self.0,
            extractor: |
                row: &tokio_postgres::Row,
            | -> Result<GetByAppointmentIdBorrowed, tokio_postgres::Error> {
                Ok(GetByAppointmentIdBorrowed {
                    id: row.try_get(0)?,
                    appointment_id: row.try_get(1)?,
                    temperature: row.try_get(2)?,
                    weight: row.try_get(3)?,
                    upper_blood_pressure: row.try_get(4)?,
                    lower_blood_pressure: row.try_get(5)?,
                    heart_pulse: row.try_get(6)?,
                    hemoglobin: row.try_get(7)?,
                    is_good_health: row.try_get(8)?,
                    note: row.try_get(9)?,
                    created_at: row.try_get(10)?,
                })
            },
            mapper: |it| GetByAppointmentId::from(it),
        }
    }
}
pub fn get_by_member_id() -> GetByMemberIdStmt {
    GetByMemberIdStmt(crate::client::async_::Stmt::new(
        "SELECT * FROM healths WHERE appointment_id IN (SELECT id FROM appointments WHERE member_id = $1) ORDER BY created_at DESC",
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
                        appointment_id: row.try_get(1)?,
                        temperature: row.try_get(2)?,
                        weight: row.try_get(3)?,
                        upper_blood_pressure: row.try_get(4)?,
                        lower_blood_pressure: row.try_get(5)?,
                        heart_pulse: row.try_get(6)?,
                        hemoglobin: row.try_get(7)?,
                        is_good_health: row.try_get(8)?,
                        note: row.try_get(9)?,
                        created_at: row.try_get(10)?,
                    })
                },
            mapper: |it| GetByMemberId::from(it),
        }
    }
}
pub fn update() -> UpdateStmt {
    UpdateStmt(crate::client::async_::Stmt::new(
        "UPDATE healths SET temperature = COALESCE($1, temperature), weight = COALESCE($2, weight), upper_blood_pressure = COALESCE($3, upper_blood_pressure), lower_blood_pressure = COALESCE($4, lower_blood_pressure), heart_pulse = COALESCE($5, heart_pulse), hemoglobin = COALESCE($6, hemoglobin), is_good_health = COALESCE($7, is_good_health), note = COALESCE($8, note) WHERE id = $9",
    ))
}
pub struct UpdateStmt(crate::client::async_::Stmt);
impl UpdateStmt {
    pub async fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        temperature: &'a Option<f32>,
        weight: &'a Option<f32>,
        upper_blood_pressure: &'a Option<i32>,
        lower_blood_pressure: &'a Option<i32>,
        heart_pulse: &'a Option<i32>,
        hemoglobin: &'a Option<f32>,
        is_good_health: &'a Option<bool>,
        note: &'a Option<T1>,
        id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client
            .execute(
                stmt,
                &[
                    temperature,
                    weight,
                    upper_blood_pressure,
                    lower_blood_pressure,
                    heart_pulse,
                    hemoglobin,
                    is_good_health,
                    note,
                    id,
                ],
            )
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
            &params.temperature,
            &params.weight,
            &params.upper_blood_pressure,
            &params.lower_blood_pressure,
            &params.heart_pulse,
            &params.hemoglobin,
            &params.is_good_health,
            &params.note,
            &params.id,
        ))
    }
}
