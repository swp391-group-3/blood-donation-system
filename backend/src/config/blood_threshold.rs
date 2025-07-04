use ctypes::{BloodComponent, BloodGroup};
use serde::Deserialize;
use std::collections::HashMap;

#[derive(Debug, Deserialize)]
pub struct BloodThresholdConfig {
    pub thresholds: HashMap<BloodGroup, HashMap<BloodComponent, i32>>,
}

impl Default for BloodThresholdConfig {
    fn default() -> Self {
        let thresholds = HashMap::from([
            (BloodGroup::OPlus, group(3000, 2000, 2500)),
            (BloodGroup::OMinus, group(3000, 2000, 2500)),
            (BloodGroup::APlus, group(1500, 1000, 1250)),
            (BloodGroup::AMinus, group(1500, 1000, 1250)),
            (BloodGroup::BPlus, group(1500, 1000, 1250)),
            (BloodGroup::BMinus, group(1500, 1000, 1250)),
            (BloodGroup::ABPlus, group(600, 500, 500)),
            (BloodGroup::ABMinus, group(600, 500, 500)),
        ]);

        Self { thresholds }
    }
}

fn group(red_cell: i32, plasma: i32, platelet: i32) -> HashMap<BloodComponent, i32> {
    HashMap::from([
        (BloodComponent::RedCell, red_cell),
        (BloodComponent::Plasma, plasma),
        (BloodComponent::Platelet, platelet),
    ])
}
