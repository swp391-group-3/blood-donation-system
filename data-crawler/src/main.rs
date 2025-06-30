use chromiumoxide::{
    browser::{Browser, BrowserConfig},
    cdp::browser_protocol::emulation::SetDeviceMetricsOverrideParams,
};
use futures::StreamExt;
use std::time::Duration;
use tokio::time::sleep;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let chrome_path = r#"C:\Program Files\Google\Chrome\Application\chrome.exe"#;

    let config = BrowserConfig::builder()
        .chrome_executable(chrome_path)
        .with_head()
        .args(vec![
            "--start-maximized".to_string(),
            "--force-device-scale-factor=1".to_string(),
        ])
        .build()?;

    let (mut browser, mut handler) = Browser::launch(config).await?;

    let handle = tokio::spawn(async move { while let Some(_) = handler.next().await {} });

    let page = browser.new_page("https://www.redcrossblood.org/").await?;

    page.execute(
        SetDeviceMetricsOverrideParams::builder()
            .width(1920)
            .height(1080)
            .device_scale_factor(1)
            .mobile(false)
            .build()
            .map_err(|e| format!("Failed to build device metrics params: {}", e))?,
    )
    .await?;

    page.wait_for_navigation().await?;

    let all_links = page
        .find_elements("ul.rcb-secondary-links-container li.rcb-secondary-links a")
        .await?;
    
    for link in all_links {
        if let Some(href) = link.attribute("href").await? {
            println!("Link: {}", href);
        }
    }

    sleep(Duration::from_secs(30)).await;

    browser.close().await?;
    handle.await?;

    Ok(())
}
