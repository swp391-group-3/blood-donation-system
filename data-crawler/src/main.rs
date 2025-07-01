use chromiumoxide::browser::{Browser, BrowserConfig};
use futures::StreamExt;
use htmd::{Element, HtmlToMarkdown};
use std::{fs::create_dir_all, path::PathBuf};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = BrowserConfig::builder().with_head().build()?;
    let (mut browser, mut handler) = Browser::launch(config).await?;

    let handle = tokio::spawn(async move { while let Some(_) = handler.next().await {} });

    let page = browser.new_page("https://www.redcrossblood.org/").await?;
    page.wait_for_navigation().await?;

    let all_links = page
        .find_elements("ul.rcb-secondary-links-container li.rcb-secondary-links a")
        .await?;

    let output_dir = PathBuf::from("../docs");
    create_dir_all(&output_dir)?;

    for link in all_links {
        let Some(href) = link.attribute("href").await? else {
            continue;
        };

        if href.starts_with("/donate-blood")
            && href != "/donate-blood/manage-my-donations/rapidpass.html"
        {
            let url = format!("https://www.redcrossblood.org{}", href);

            let subpage = browser.new_page(&url).await?;
            subpage.wait_for_navigation().await?;

            let html = subpage.content().await?;
            let md = HtmlToMarkdown::builder()
                .skip_tags(vec!["script", "style", "header", "footer"])
                .add_handler(vec!["a"], |e: Element| Some(e.content.to_string()))
                .build()
                .convert(&html)
                .unwrap();

            let formatted_name = href
                .trim_start_matches("/donate-blood/blood-donation-process/")
                .trim_start_matches("/donate-blood/how-to-donate/")
                .trim_start_matches("/donate-blood/")
                .trim_end_matches(".html")
                .replace('/', "_")
                .replace('-', "_");

            let filename = format!("{}.md", formatted_name);
            let path = output_dir.join(filename);
            tokio::fs::write(path, md).await?;

            subpage.close().await?;
        }
    }

    page.close().await?;
    browser.close().await?;
    handle.await?;

    Ok(())
}
