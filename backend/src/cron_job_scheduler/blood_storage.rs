use std::collections::HashMap;

use crate::{CONFIG, util::notification::send};

use ctypes::{BloodComponent, BloodGroup, Role};
use database::{deadpool_postgres, queries};
use lettre::{AsyncSmtpTransport, Tokio1Executor};

pub async fn alert_low_stock(
    database_pool: &deadpool_postgres::Pool,
    mailer: &AsyncSmtpTransport<Tokio1Executor>,
) -> anyhow::Result<()> {
    let database = database_pool.get().await?;

    let blood_bags = queries::blood_bag::get_all_scheduler().bind(&database).all().await?;

    let mut stock_map: HashMap<(BloodGroup, BloodComponent), i32> = HashMap::new();

    for blood_bag in blood_bags {
        if blood_bag.is_used {
            continue;
        }
        let key: (BloodGroup, BloodComponent) = (blood_bag.blood_group, blood_bag.component);
        *stock_map.entry(key).or_insert(0) += blood_bag.amount;
    }

    let mut low_stock_flag = false;

    let mut body =
        "<p>Our system has detected <strong>critically low levels</strong> in the following blood components:</p>
        <table border=\"1\" cellpadding=\"8\" cellspacing=\"0\" style=\"border-collapse: collapse; font-family: Arial, sans-serif;\">
            <thead style=\"background-color: #f44336; color: white;\">
                <tr>
                    <th>Blood Group</th>
                    <th>Component</th>
                    <th>Current Amount (ml)</th>
                    <th>Threshold (ml)</th>
                </tr>
            </thead>
            <tbody>".to_string();

    for (blood_group, component_map) in &CONFIG.blood.thresholds {
        for (component, threshold) in component_map {
            let current_amount = *stock_map.get(&(*blood_group, *component)).unwrap_or(&0);

            if current_amount < *threshold {
                low_stock_flag = true;
                body.push_str(&format!(
                    "<tr>
                        <td>{blood_group:?}</td>
                        <td>{component:?}</td>
                        <td>{current_amount}</td>
                        <td>{threshold}</td>
                    </tr>"
                ));
            }
        }
    }

    if !low_stock_flag {
        tracing::info!("No low stock detected, skipping alert.");
        return Ok(());
    }

    body.push_str(
                "</tbody>
            </table>
            <p>Please initiate restocking procedures immediately or adjust usage priorities as needed.</p>
            <p>Thank you for your prompt attention to this matter.</p>
            <p>Sincerely,<br>Blood Donation Team</p>
        </body>
        </html>"
    );

    let accounts = queries::account::get_by_role()
        .bind(&database, &Role::Staff)
        .all()
        .await?;

    for account in &accounts {
        let subject = "URGENT: Low Blood Stock Alert".to_string();

        let mut final_body = format!(
            "<html>
            <body>
                <p>Dear <strong>{}</strong>,</p>",
            account.name
        );
        final_body.push_str(&body);

        send(account, subject, final_body, mailer).await?;
    }

    Ok(())
}
