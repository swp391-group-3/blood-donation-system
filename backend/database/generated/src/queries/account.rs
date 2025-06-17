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
    pub birthday: crate::types::time::Date,
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
    pub birthday: Option<crate::types::time::Date>,
    pub id: uuid::Uuid,
}
#[derive(Debug, Clone, PartialEq)]
pub struct GetByEmail {
    pub id: uuid::Uuid,
    pub password: String,
}
pub struct GetByEmailBorrowed<'a> {
    pub id: uuid::Uuid,
    pub password: &'a str,
}
impl<'a> From<GetByEmailBorrowed<'a>> for GetByEmail {
    fn from(GetByEmailBorrowed { id, password }: GetByEmailBorrowed<'a>) -> Self {
        Self {
            id,
            password: password.into(),
        }
    }
}
#[derive(Debug, Clone, PartialEq)]
pub struct Get {
    pub role: ctypes::Role,
    pub email: String,
    pub phone: String,
    pub name: String,
    pub gender: Option<ctypes::Gender>,
    pub address: Option<String>,
    pub birthday: Option<crate::types::time::Date>,
    pub blood_group: Option<ctypes::BloodGroup>,
    pub is_active: bool,
    pub created_at: crate::types::time::TimestampTz,
}
pub struct GetBorrowed<'a> {
    pub role: ctypes::Role,
    pub email: &'a str,
    pub phone: &'a str,
    pub name: &'a str,
    pub gender: Option<ctypes::Gender>,
    pub address: Option<&'a str>,
    pub birthday: Option<crate::types::time::Date>,
    pub blood_group: Option<ctypes::BloodGroup>,
    pub is_active: bool,
    pub created_at: crate::types::time::TimestampTz,
}
impl<'a> From<GetBorrowed<'a>> for Get {
    fn from(
        GetBorrowed {
            role,
            email,
            phone,
            name,
            gender,
            address,
            birthday,
            blood_group,
            is_active,
            created_at,
        }: GetBorrowed<'a>,
    ) -> Self {
        Self {
            role,
            email: email.into(),
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
#[derive(Debug, Clone, PartialEq)]
pub struct GetAll {
    pub role: ctypes::Role,
    pub email: String,
    pub phone: String,
    pub name: String,
    pub gender: Option<ctypes::Gender>,
    pub address: Option<String>,
    pub birthday: Option<crate::types::time::Date>,
    pub blood_group: Option<ctypes::BloodGroup>,
    pub is_active: bool,
    pub created_at: crate::types::time::TimestampTz,
}
pub struct GetAllBorrowed<'a> {
    pub role: ctypes::Role,
    pub email: &'a str,
    pub phone: &'a str,
    pub name: &'a str,
    pub gender: Option<ctypes::Gender>,
    pub address: Option<&'a str>,
    pub birthday: Option<crate::types::time::Date>,
    pub blood_group: Option<ctypes::BloodGroup>,
    pub is_active: bool,
    pub created_at: crate::types::time::TimestampTz,
}
impl<'a> From<GetAllBorrowed<'a>> for GetAll {
    fn from(
        GetAllBorrowed {
            role,
            email,
            phone,
            name,
            gender,
            address,
            birthday,
            blood_group,
            is_active,
            created_at,
        }: GetAllBorrowed<'a>,
    ) -> Self {
        Self {
            role,
            email: email.into(),
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
pub struct GetByEmailQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<GetByEmailBorrowed, tokio_postgres::Error>,
    mapper: fn(GetByEmailBorrowed) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> GetByEmailQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(
        self,
        mapper: fn(GetByEmailBorrowed) -> R,
    ) -> GetByEmailQuery<'c, 'a, 's, C, R, N> {
        GetByEmailQuery {
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
pub struct GetQuery<'c, 'a, 's, C: GenericClient, T, const N: usize> {
    client: &'c C,
    params: [&'a (dyn postgres_types::ToSql + Sync); N],
    stmt: &'s mut crate::client::async_::Stmt,
    extractor: fn(&tokio_postgres::Row) -> Result<GetBorrowed, tokio_postgres::Error>,
    mapper: fn(GetBorrowed) -> T,
}
impl<'c, 'a, 's, C, T: 'c, const N: usize> GetQuery<'c, 'a, 's, C, T, N>
where
    C: GenericClient,
{
    pub fn map<R>(self, mapper: fn(GetBorrowed) -> R) -> GetQuery<'c, 'a, 's, C, R, N> {
        GetQuery {
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
        birthday: &'a crate::types::time::Date,
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
pub fn get_by_email() -> GetByEmailStmt {
    GetByEmailStmt(crate::client::async_::Stmt::new(
        "SELECT id, password FROM accounts WHERE email = $1",
    ))
}
pub struct GetByEmailStmt(crate::client::async_::Stmt);
impl GetByEmailStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient, T1: crate::StringSql>(
        &'s mut self,
        client: &'c C,
        email: &'a T1,
    ) -> GetByEmailQuery<'c, 'a, 's, C, GetByEmail, 1> {
        GetByEmailQuery {
            client,
            params: [email],
            stmt: &mut self.0,
            extractor:
                |row: &tokio_postgres::Row| -> Result<GetByEmailBorrowed, tokio_postgres::Error> {
                    Ok(GetByEmailBorrowed {
                        id: row.try_get(0)?,
                        password: row.try_get(1)?,
                    })
                },
            mapper: |it| GetByEmail::from(it),
        }
    }
}
pub fn get() -> GetStmt {
    GetStmt(crate::client::async_::Stmt::new(
        "SELECT role, email, phone, name, gender, address, birthday, blood_group, is_active, created_at FROM accounts WHERE id = $1",
    ))
}
pub struct GetStmt(crate::client::async_::Stmt);
impl GetStmt {
    pub fn bind<'c, 'a, 's, C: GenericClient>(
        &'s mut self,
        client: &'c C,
        id: &'a uuid::Uuid,
    ) -> GetQuery<'c, 'a, 's, C, Get, 1> {
        GetQuery {
            client,
            params: [id],
            stmt: &mut self.0,
            extractor: |row: &tokio_postgres::Row| -> Result<GetBorrowed, tokio_postgres::Error> {
                Ok(GetBorrowed {
                    role: row.try_get(0)?,
                    email: row.try_get(1)?,
                    phone: row.try_get(2)?,
                    name: row.try_get(3)?,
                    gender: row.try_get(4)?,
                    address: row.try_get(5)?,
                    birthday: row.try_get(6)?,
                    blood_group: row.try_get(7)?,
                    is_active: row.try_get(8)?,
                    created_at: row.try_get(9)?,
                })
            },
            mapper: |it| Get::from(it),
        }
    }
}
pub fn get_all() -> GetAllStmt {
    GetAllStmt(crate::client::async_::Stmt::new(
        "SELECT role, email, phone, name, gender, address, birthday, blood_group, is_active, created_at FROM accounts",
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
                        role: row.try_get(0)?,
                        email: row.try_get(1)?,
                        phone: row.try_get(2)?,
                        name: row.try_get(3)?,
                        gender: row.try_get(4)?,
                        address: row.try_get(5)?,
                        birthday: row.try_get(6)?,
                        blood_group: row.try_get(7)?,
                        is_active: row.try_get(8)?,
                        created_at: row.try_get(9)?,
                    })
                },
            mapper: |it| GetAll::from(it),
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
        birthday: &'a Option<crate::types::time::Date>,
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
