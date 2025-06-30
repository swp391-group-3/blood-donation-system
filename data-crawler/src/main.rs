use chromiumoxide::{
    browser::{Browser, BrowserConfig},
    cdp::browser_protocol::page::PrintToPdfParams,
};
use futures::StreamExt;
use tokio::time::sleep;
use std::{fs::create_dir_all, path::PathBuf, time::Duration};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let chrome_path = r#"C:\Program Files\Google\Chrome\Application\chrome.exe"#;

    let config = BrowserConfig::builder()
        .chrome_executable(chrome_path)
        .with_head()
        .build()?;

    let (mut browser, mut handler) = Browser::launch(config).await?;

    let handle = tokio::spawn(async move { while let Some(_) = handler.next().await {} });

    let page = browser.new_page("https://www.redcrossblood.org/").await?;
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
                subpage.wait_for_navigation().await?;

                let all_buttons = subpage
                    .find_elements("span[role='presentation']")
                    .await
                    .unwrap_or_default();

                if !all_buttons.is_empty() {
                    for button in all_buttons {
                        let _ = button.click().await;
                        sleep(Duration::from_secs(1)).await;
                    }
                }

                sleep(Duration::from_secs(15)).await;
                
                let mut pdf_params = PrintToPdfParams::default();
                pdf_params.landscape = Some(true);
                pdf_params.margin_left = Some(0.0);
                pdf_params.margin_right = Some(0.0);
                pdf_params.scale = Some(0.75);

                let pdf_bytes = subpage.pdf(pdf_params).await?;

                let formatted_name = href
                    .trim_start_matches("/donate-blood/blood-donation-process/")
                    .trim_start_matches("/donate-blood/how-to-donate/")
                    .trim_start_matches("/donate-blood/")
                    .trim_end_matches(".html")
                    .replace('/', "_")
                    .replace('-', "_");

                let filename = format!("{}.pdf", formatted_name);
                let path = output_dir.join(filename);
                tokio::fs::write(path, pdf_bytes).await?;

                subpage.close().await?;
            }
        }
    }

    page.close().await?;
    browser.close().await?;
    handle.await?;

    Ok(())
}
