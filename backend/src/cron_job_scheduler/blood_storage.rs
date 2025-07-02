use std::{error::Error, sync::Arc};

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

    Ok(())
}
