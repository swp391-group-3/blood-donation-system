use ctypes::BloodGroup;
use std::collections::HashSet;

pub fn get_compatible(donor: BloodGroup) -> HashSet<BloodGroup> {
    use BloodGroup::*;
    match donor {
        OMinus => [OMinus, OPlus, AMinus, APlus, BMinus, BPlus, ABMinus, ABPlus]
            .into_iter()
            .collect(),
        OPlus => [OPlus, APlus, BPlus, ABPlus].into_iter().collect(),
        AMinus => [AMinus, APlus, ABMinus, ABPlus].into_iter().collect(),
        APlus => [APlus, ABPlus].into_iter().collect(),
        BMinus => [BMinus, BPlus, ABMinus, ABPlus].into_iter().collect(),
        BPlus => [BPlus, ABPlus].into_iter().collect(),
        ABMinus => [ABMinus, ABPlus].into_iter().collect(),
        ABPlus => [ABPlus].into_iter().collect(),
    }
}

#[allow(unused)]
pub fn get_compatible_donors(recipient: BloodGroup) -> HashSet<BloodGroup> {
    use BloodGroup::*;
    match recipient {
        ABPlus => [OMinus, OPlus, AMinus, APlus, BMinus, BPlus, ABMinus, ABPlus]
            .into_iter()
            .collect(),
        ABMinus => [OMinus, AMinus, BMinus, ABMinus].into_iter().collect(),
        BPlus => [OMinus, OPlus, BMinus, BPlus].into_iter().collect(),
        BMinus => [OMinus, BMinus].into_iter().collect(),
        APlus => [OMinus, OPlus, AMinus, APlus].into_iter().collect(),
        AMinus => [OMinus, AMinus].into_iter().collect(),
        OPlus => [OMinus, OPlus].into_iter().collect(),
        OMinus => [OMinus].into_iter().collect(),
    }
}
