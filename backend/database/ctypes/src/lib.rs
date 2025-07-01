use postgres_types::{FromSql, ToSql};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(
    Debug, Clone, Copy, PartialEq, Eq, Hash, ToSql, FromSql, Serialize, Deserialize, ToSchema,
)]
#[serde(rename_all = "snake_case")]
#[postgres(name = "blood_group", rename_all = "snake_case")]
pub enum BloodGroup {
    OPlus,
    OMinus,
    APlus,
    AMinus,
    BPlus,
    BMinus,
    ABPlus,
    ABMinus,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, ToSql, FromSql, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
#[postgres(name = "role", rename_all = "snake_case")]
pub enum Role {
    Member,
    Staff,
    Admin,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, ToSql, FromSql, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
#[postgres(name = "request_priority", rename_all = "snake_case")]
pub enum RequestPriority {
    Low,
    Medium,
    High,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, ToSql, FromSql, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
#[postgres(name = "donation_type", rename_all = "snake_case")]
pub enum DonationType {
    WholeBlood,
    PowerRed,
    Platelet,
    Plasma,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, ToSql, FromSql, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
#[postgres(name = "blood_component", rename_all = "snake_case")]
pub enum BloodComponent {
    RedCell,
    Platelet,
    Plasma,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, ToSql, FromSql, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
#[postgres(name = "gender", rename_all = "snake_case")]
pub enum Gender {
    Male,
    Female,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, ToSql, FromSql, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
#[postgres(name = "appointment_status", rename_all = "snake_case")]
pub enum AppointmentStatus {
    OnProcess,
    Approved,
    CheckedIn,
    Donated,
    Done,
    Rejected,
}
