use std::{collections::HashMap, error::Error, sync::Arc};

use crate::CONFIG;
use ctypes::{BloodComponent, BloodGroup};
use database::queries;

use crate::state::ApiState;

pub async fn alert_low_stock(state: Arc<ApiState>) -> Result<(), Box<dyn Error>> {
    let database = state.database().await?;

    let blood_bags = match queries::blood_bag::get_all().bind(&database).all().await {
        Ok(blood_bags) => blood_bags,
        Err(error) => {
            tracing::error!(?error, "Failed to get blood bag list");

            return Err(Box::new(error));
        }
    };

    let mut stock_map: HashMap<(BloodGroup, BloodComponent), i32> = HashMap::new();

    for blood_bag in blood_bags {
        if blood_bag.is_used {
            continue;
        }
        let key: (BloodGroup, BloodComponent) = (blood_bag.blood_group, blood_bag.component);
        *stock_map.entry(key).or_insert(0) += blood_bag.amount;
    }

    let mut body =
        String::from("WARNING!!!\n\nThe following blood components are below safe levels:\n");

    for (group, component_map) in &CONFIG.blood.thresholds {
        for (component, threshold) in component_map {
            let current_amount = *stock_map.get(&(*group, *component)).unwrap_or(&0);

            if current_amount < *threshold {
                body.push_str(&format!(
                    "- {:?} {:?}: {}ml (threshold: {}ml)\n",
                    group, component, current_amount, threshold
                ));
            }
        }
    }

    body.push_str(
        "\nPlease take appropriate action to restock or prioritize usage.\n\n\
        Thank you for your attention.",
    );

    println!("{}", body);

    Ok(())
}
