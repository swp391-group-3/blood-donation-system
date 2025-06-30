use chromiumoxide::{
    browser::{Browser, BrowserConfig},
    cdp::browser_protocol::{emulation::SetDeviceMetricsOverrideParams, page::PrintToPdfParams},
};
use futures::StreamExt;
use std::{fs::create_dir_all, path::PathBuf, time::Duration};
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

    let output_dir = PathBuf::from("output_pdfs");
    create_dir_all(&output_dir)?;

    for link in all_links {
        if let Some(href) = link.attribute("href").await? {
            if href.starts_with("/donate-blood")
                && href != "/donate-blood/manage-my-donations/rapidpass.html"
            {
                let url = format!("https://www.redcrossblood.org{}", href);
                
                let subpage = browser.new_page(&url).await?;
                subpage
                    .execute(
                        SetDeviceMetricsOverrideParams::builder()
                            .width(1920)
                            .height(1080)
                            .device_scale_factor(1)
                            .mobile(false)
                            .build()
                            .map_err(|e| format!("Failed to build device metrics params: {}", e))?,
                    )
                    .await?;
                
                subpage.wait_for_navigation().await?;
                
                let pdf_bytes = subpage
                    .pdf(PrintToPdfParams::default())
                    .await?;

                let name = href
                    .trim_start_matches('/')
                    .trim_end_matches(".html")
                    .replace('/', "_")
                    .replace('-', "_");

                let filename = format!("{}.pdf", name);
                let path = output_dir.join(filename);
                tokio::fs::write(path, pdf_bytes).await?;
            }
        }
    }

    sleep(Duration::from_secs(30)).await;

    browser.close().await?;
    handle.await?;

    Ok(())
}
