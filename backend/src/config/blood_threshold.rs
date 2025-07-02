use ctypes::{BloodComponent, BloodGroup};
use serde::Deserialize;
use std::collections::HashMap;

#[derive(Debug, Deserialize, Clone)]
pub struct BloodThresholdConfig {
    pub thresholds: HashMap<BloodGroup, HashMap<BloodComponent, i32>>,
}

impl Default for BloodThresholdConfig {
    fn default() -> Self {
        let mut thresholds = HashMap::new();

        thresholds.insert(BloodGroup::OPlus, group(3000, 2000, 2500));
        thresholds.insert(BloodGroup::OMinus, group(3000, 2000, 2500));
        thresholds.insert(BloodGroup::APlus, group(1500, 1000, 1250));
        thresholds.insert(BloodGroup::AMinus, group(1500, 1000, 1250));
        thresholds.insert(BloodGroup::BPlus, group(1500, 1000, 1250));
        thresholds.insert(BloodGroup::BMinus, group(1500, 1000, 1250));
        thresholds.insert(BloodGroup::ABPlus, group(600, 500, 500));
        thresholds.insert(BloodGroup::ABMinus, group(600, 500, 500));

        Self { thresholds }
    }
}

fn group(red_cell: i32, plasma: i32, platelet: i32) -> HashMap<BloodComponent, i32> {
    let mut map = HashMap::new();
    map.insert(BloodComponent::RedCell, red_cell);
    map.insert(BloodComponent::Plasma, plasma);
    map.insert(BloodComponent::Platelet, platelet);
    map
}
