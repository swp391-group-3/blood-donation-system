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
