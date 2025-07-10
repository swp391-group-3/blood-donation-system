// This file was generated with `clorinde`. Do not modify.

#[derive(Debug)]
pub struct RegisterParams<
    T1: crate::StringSql,
    T2: crate::StringSql,
    T3: crate::StringSql,
    T4: crate::StringSql,
    T5: crate::StringSql,
> {
    pub email: T1,
    pub password: Option<T2>,
    pub phone: T3,
    pub name: T4,
    pub gender: ctypes::Gender,
    pub address: T5,
    pub birthday: chrono::NaiveDate,
    pub blood_group: ctypes::BloodGroup,
}
#[derive(Debug)]
pub struct CreateStaffParams<
    T1: crate::StringSql,
    T2: crate::StringSql,
    T3: crate::StringSql,
    T4: crate::StringSql,
> {
    pub email: T1,
    pub password: T2,
    pub phone: T3,
    pub name: T4,
}
#[derive(Debug)]
pub struct UpdateParams<T1: crate::StringSql, T2: crate::StringSql, T3: crate::StringSql> {
    pub phone: Option<T1>,
    pub name: Option<T2>,
    pub gender: Option<ctypes::Gender>,
    pub address: Option<T3>,
    pub birthday: Option<chrono::NaiveDate>,
    pub id: uuid::Uuid,
}
#[derive(serde::Serialize, Debug, Clone, PartialEq, utoipa::ToSchema)]
pub struct Account {
    pub id: uuid::Uuid,
    pub role: ctypes::Role,
    pub email: String,
    pub password: String,
    pub phone: String,
    pub name: String,
    pub gender: Option<ctypes::Gender>,
    pub address: Option<String>,
    pub birthday: Option<chrono::NaiveDate>,
    pub blood_group: Option<ctypes::BloodGroup>,
    pub is_active: bool,
    pub created_at: chrono::DateTime<chrono::FixedOffset>,
}
pub struct AccountBorrowed<'a> {
    pub id: uuid::Uuid,
    pub role: ctypes::Role,
    pub email: &'a str,
    pub password: &'a str,
    pub phone: &'a str,
    pub name: &'a str,
    pub gender: Option<ctypes::Gender>,
    pub address: Option<&'a str>,
    pub birthday: Option<chrono::NaiveDate>,
    pub blood_group: Option<ctypes::BloodGroup>,
    pub is_active: bool,
    pub created_at: chrono::DateTime<chrono::FixedOffset>,
}
impl<'a> From<AccountBorrowed<'a>> for Account {
    fn from(
        AccountBorrowed {
            id,
            role,
            email,
            password,
            phone,
            name,
            gender,
            address,
            birthday,
            blood_group,
            is_active,
            created_at,
        }: AccountBorrowed<'a>,
    ) -> Self {
        Self {
            id,
            role,
            email: email.into(),
            password: password.into(),
            phone: phone.into(),
            name: name.into(),
            gender,
            address: address.map(|v| v.into()),
            birthday,
            blood_group,
            is_active,
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
pub struct AccountQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<AccountBorrowed, tokio_postgres::Error>,
    mapper: fn(AccountBorrowed) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> AccountQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(AccountBorrowed) -> R) -> AccountQuery<'c, 'a, 's, C, R, N> {
        AccountQuery {
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
pub struct BoolQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<bool, tokio_postgres::Error>,
    mapper: fn(bool) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> BoolQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(bool) -> R) -> BoolQuery<'c, 'a, 's, C, R, N> {
        BoolQuery {
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
pub fn register() -> RegisterStmt {
    RegisterStmt(crate::client::async_::Stmt::new(
        "INSERT INTO accounts( email, password, role, phone, name, gender, address, birthday, blood_group ) VALUES( $1, COALESCE($2, substr(md5(random()::text), 1, 25)), 'member'::role, $3, $4, $5, $6, $7, $8 ) RETURNING id",
    ))
}
pub struct RegisterStmt(crate::client::async_::Stmt);
impl RegisterStmt {
    pub fn bind<
        'c,
        'a,
        's,
        C: GenericClient,
        T1: crate::StringSql,
        T2: crate::StringSql,
        T3: crate::StringSql,
        T4: crate::StringSql,
        T5: crate::StringSql,
    >(
        &'s mut self,
        client: &'c C,
        email: &'a T1,
        password: &'a Option<T2>,
        phone: &'a T3,
        name: &'a T4,
        gender: &'a ctypes::Gender,
        address: &'a T5,
        birthday: &'a chrono::NaiveDate,
        blood_group: &'a ctypes::BloodGroup,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 8> {
        UuidUuidQuery {
            client,
            params: [
                email,
                password,
                phone,
                name,
                gender,
                address,
                birthday,
                blood_group,
            ],
            stmt: &mut self.0,
            extractor: |row| Ok(row.try_get(0)?),
            mapper: |it| it,
        }
    }
}
impl<
        'c,
        'a,
        's,
        C: GenericClient,
        T1: crate::StringSql,
        T2: crate::StringSql,
        T3: crate::StringSql,
        T4: crate::StringSql,
        T5: crate::StringSql,
    >
    crate::client::async_::Params<
        'c,
        'a,
        's,
        RegisterParams<T1, T2, T3, T4, T5>,
        UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 8>,
        C,
    > for RegisterStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a RegisterParams<T1, T2, T3, T4, T5>,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 8> {
        self.bind(
            client,
            &params.email,
            &params.password,
            &params.phone,
            &params.name,
            &params.gender,
            &params.address,
            &params.birthday,
            &params.blood_group,
        )
    }
}
pub fn create_staff() -> CreateStaffStmt {
    CreateStaffStmt(crate::client::async_::Stmt::new(
        "INSERT INTO accounts( email, password, role, phone, name, is_active ) VALUES ( $1, $2, 'staff'::role, $3, $4, true ) RETURNING id",
    ))
}
pub struct CreateStaffStmt(crate::client::async_::Stmt);
impl CreateStaffStmt {
    pub fn bind<
        'c,
        'a,
        's,
        C: GenericClient,
        T1: crate::StringSql,
        T2: crate::StringSql,
        T3: crate::StringSql,
        T4: crate::StringSql,
    >(
        &'s mut self,
        client: &'c C,
        email: &'a T1,
        password: &'a T2,
        phone: &'a T3,
        name: &'a T4,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 4> {
        UuidUuidQuery {
            client,
            params: [email, password, phone, name],
            stmt: &mut self.0,
            extractor: |row| Ok(row.try_get(0)?),
            mapper: |it| it,
        }
    }
}
impl<
        'c,
        'a,
        's,
        C: GenericClient,
        T1: crate::StringSql,
        T2: crate::StringSql,
        T3: crate::StringSql,
        T4: crate::StringSql,
    >
    crate::client::async_::Params<
        'c,
        'a,
        's,
        CreateStaffParams<T1, T2, T3, T4>,
        UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 4>,
        C,
    > for CreateStaffStmt
{
    fn params(
        &'s mut self,
        client: &'c C,
        params: &'a CreateStaffParams<T1, T2, T3, T4>,
    ) -> UuidUuidQuery<'c, 'a, 's, C, uuid::Uuid, 4> {
        self.bind(
            client,
            &params.email,
            &params.password,
            &params.phone,
            &params.name,
        )
    }
}
pub fn get() -> GetStmt {
    GetStmt(crate::client::async_::Stmt::new(
        "SELECT * FROM accounts WHERE id = $1",
    ))
}
pub struct GetStmt(crate::client::async_::Stmt);
impl GetStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        id: &'a uuid::Uuid,
    ) -> AccountQuery<'c, 'a, 's, C, Account, 1> {
        AccountQuery {
            client,
            params: [id],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<AccountBorrowed, tokio_postgres::Error> {
                    Ok(AccountBorrowed {
                        id: row.try_get(0)?,
                        role: row.try_get(1)?,
                        email: row.try_get(2)?,
                        password: row.try_get(3)?,
                        phone: row.try_get(4)?,
                        name: row.try_get(5)?,
                        gender: row.try_get(6)?,
                        address: row.try_get(7)?,
                        birthday: row.try_get(8)?,
                        blood_group: row.try_get(9)?,
                        is_active: row.try_get(10)?,
                        created_at: row.try_get(11)?,
                    })
                },
            mapper: |it| Account::from(it),
        }
    }
}
pub fn get_by_email() -> GetByEmailStmt {
    GetByEmailStmt(crate::client::async_::Stmt::new(
        "SELECT * FROM accounts WHERE email = $1 AND is_active = true",
    ))
}
pub struct GetByEmailStmt(crate::client::async_::Stmt);
impl GetByEmailStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        email: &'a T1,
    ) -> AccountQuery<'c, 'a, 's, C, Account, 1> {
        AccountQuery {
            client,
            params: [email],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<AccountBorrowed, tokio_postgres::Error> {
                    Ok(AccountBorrowed {
                        id: row.try_get(0)?,
                        role: row.try_get(1)?,
                        email: row.try_get(2)?,
                        password: row.try_get(3)?,
                        phone: row.try_get(4)?,
                        name: row.try_get(5)?,
                        gender: row.try_get(6)?,
                        address: row.try_get(7)?,
                        birthday: row.try_get(8)?,
                        blood_group: row.try_get(9)?,
                        is_active: row.try_get(10)?,
                        created_at: row.try_get(11)?,
                    })
                },
            mapper: |it| Account::from(it),
        }
    }
}
pub fn get_by_role() -> GetByRoleStmt {
    GetByRoleStmt(crate::client::async_::Stmt::new(
        "SELECT * FROM accounts WHERE role = $1 AND is_active = true",
    ))
}
pub struct GetByRoleStmt(crate::client::async_::Stmt);
impl GetByRoleStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        role: &'a ctypes::Role,
    ) -> AccountQuery<'c, 'a, 's, C, Account, 1> {
        AccountQuery {
            client,
            params: [role],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<AccountBorrowed, tokio_postgres::Error> {
                    Ok(AccountBorrowed {
                        id: row.try_get(0)?,
                        role: row.try_get(1)?,
                        email: row.try_get(2)?,
                        password: row.try_get(3)?,
                        phone: row.try_get(4)?,
                        name: row.try_get(5)?,
                        gender: row.try_get(6)?,
                        address: row.try_get(7)?,
                        birthday: row.try_get(8)?,
                        blood_group: row.try_get(9)?,
                        is_active: row.try_get(10)?,
                        created_at: row.try_get(11)?,
                    })
                },
            mapper: |it| Account::from(it),
        }
    }
}
pub fn get_all() -> GetAllStmt {
    GetAllStmt(crate::client::async_::Stmt::new(
        "SELECT * FROM accounts WHERE is_active = true",
    ))
}
pub struct GetAllStmt(crate::client::async_::Stmt);
impl GetAllStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
    ) -> AccountQuery<'c, 'a, 's, C, Account, 0> {
        AccountQuery {
            client,
            params: [],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<AccountBorrowed, tokio_postgres::Error> {
                    Ok(AccountBorrowed {
                        id: row.try_get(0)?,
                        role: row.try_get(1)?,
                        email: row.try_get(2)?,
                        password: row.try_get(3)?,
                        phone: row.try_get(4)?,
                        name: row.try_get(5)?,
                        gender: row.try_get(6)?,
                        address: row.try_get(7)?,
                        birthday: row.try_get(8)?,
                        blood_group: row.try_get(9)?,
                        is_active: row.try_get(10)?,
                        created_at: row.try_get(11)?,
                    })
                },
            mapper: |it| Account::from(it),
        }
    }
}
pub fn update() -> UpdateStmt {
    UpdateStmt(crate::client::async_::Stmt::new(
        "UPDATE accounts SET phone = COALESCE($1, phone), name = COALESCE($2, name), gender = COALESCE($3, gender), address = COALESCE($4, address), birthday = COALESCE($5, birthday) WHERE id = $6",
    ))
}
pub struct UpdateStmt(crate::client::async_::Stmt);
impl UpdateStmt {
    pub async fn bind<
        'c,
        'a,
        's,
        C: GenericClient,
        T1: crate::StringSql,
        T2: crate::StringSql,
        T3: crate::StringSql,
    >(
        &'s mut self,
        client: &'c C,
        phone: &'a Option<T1>,
        name: &'a Option<T2>,
        gender: &'a Option<ctypes::Gender>,
        address: &'a Option<T3>,
        birthday: &'a Option<chrono::NaiveDate>,
        id: &'a uuid::Uuid,
    ) -> Result<u64, tokio_postgres::Error> {
        let stmt = self.0.prepare(client).await?;
        client
            .execute(stmt, &[phone, name, gender, address, birthday, id])
            .await
    }
}
impl<
        'a,
        C: GenericClient + Send + Sync,
        T1: crate::StringSql,
        T2: crate::StringSql,
        T3: crate::StringSql,
    >
    crate::client::async_::Params<
        'a,
        'a,
        'a,
        UpdateParams<T1, T2, T3>,
        std::pin::Pin<
            Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
        >,
        C,
    > for UpdateStmt
{
    fn params(
        &'a mut self,
        client: &'a C,
        params: &'a UpdateParams<T1, T2, T3>,
    ) -> std::pin::Pin<
        Box<dyn futures::Future<Output = Result<u64, tokio_postgres::Error>> + Send + 'a>,
    > {
        Box::pin(self.bind(
            client,
            &params.phone,
            &params.name,
            &params.gender,
            &params.address,
            &params.birthday,
            &params.id,
        ))
    }
}
pub fn delete() -> DeleteStmt {
    DeleteStmt(crate::client::async_::Stmt::new(
        "UPDATE accounts SET is_active = false WHERE id = $1",
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
pub fn next_donatable_date() -> NextDonatableDateStmt {
    NextDonatableDateStmt(crate::client::async_::Stmt::new(
        "SELECT COALESCE(( SELECT CASE WHEN ( donations.created_at + CASE WHEN donations.type = 'whole_blood' THEN INTERVAL '56 days' WHEN donations.type = 'power_red' THEN INTERVAL '112 days' WHEN donations.type = 'platelet' THEN INTERVAL '7 days' WHEN donations.type = 'plasma' THEN INTERVAL '28 days' END ) <= now() THEN now() ELSE ( donations.created_at + CASE WHEN donations.type = 'whole_blood' THEN INTERVAL '56 days' WHEN donations.type = 'power_red' THEN INTERVAL '112 days' WHEN donations.type = 'platelet' THEN INTERVAL '7 days' WHEN donations.type = 'plasma' THEN INTERVAL '28 days' END ) END FROM donations WHERE ( SELECT member_id FROM appointments WHERE id = donations.appointment_id ) = $1 ORDER BY donations.created_at DESC LIMIT 1 ), now()) AS next_donatable_date",
    ))
}
pub struct NextDonatableDateStmt(crate::client::async_::Stmt);
impl NextDonatableDateStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        id: &'a uuid::Uuid,
    ) -> ChronoDateTimechronoFixedOffsetQuery<'c, 'a, 's, C, chrono::DateTime<chrono::FixedOffset>, 1>
    {
        ChronoDateTimechronoFixedOffsetQuery {
            client,
            params: [id],
            stmt: &mut self.0,
            extractor: |row| Ok(row.try_get(0)?),
            mapper: |it| it,
        }
    }
}
pub fn is_applied() -> IsAppliedStmt {
    IsAppliedStmt(crate::client::async_::Stmt::new(
        "SELECT EXISTS ( SELECT 1 FROM appointments WHERE member_id = $1 AND status != 'rejected'::appointment_status AND status != 'done'::appointment_status ) AS is_applied",
    ))
}
pub struct IsAppliedStmt(crate::client::async_::Stmt);
impl IsAppliedStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        id: &'a uuid::Uuid,
    ) -> BoolQuery<'c, 'a, 's, C, bool, 1> {
        BoolQuery {
            client,
            params: [id],
            stmt: &mut self.0,
            extractor: |row| Ok(row.try_get(0)?),
            mapper: |it| it,
        }
    }
}
