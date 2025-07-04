use chromiumoxide::browser::{Browser, BrowserConfig};
use futures::StreamExt;
use htmd::{Element, HtmlToMarkdown};
use std::{fs::create_dir_all, path::PathBuf};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = BrowserConfig::builder().with_head().build()?;
    let (mut browser, mut handler) = Browser::launch(config).await?;

    let handle = tokio::spawn(async move { while let Some(_) = handler.next().await {} });

    let output_dir = PathBuf::from("../docs");
    create_dir_all(&output_dir)?;

    let page = browser.new_page("https://www.redcrossblood.org/").await?;
    page.wait_for_navigation().await?;

    let all_links = page
        .find_elements("ul.rcb-secondary-links-container li.rcb-secondary-links a")
        .await?;

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
                .add_handler(vec!["img"], |e: Element| {
                    e.attrs
                        .iter()
                        .find(|a| a.name.local.as_ref() == "alt")
                        .map(|a| format!("![{}]", a.value))
                })
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

    let page = browser
        .new_page("https://www.oneblood.org/give-blood/blood-types.html")
        .await?;
    page.wait_for_navigation().await?;

    let all_links = page
        .find_elements("ul.cmp__list__dropdown li.cmp__list__link a")
        .await?;

    let mut count = 0;
    for link in all_links {
        let Some(href) = link.attribute("href").await? else {
            continue;
        };

        if count == 5 {
            break;
        }

        if href.starts_with("/give-blood") && href != "/give-blood/blood-types.html" {
            let url = format!("https://www.oneblood.org{}", href);

            let subpage = browser.new_page(&url).await?;
            subpage.wait_for_navigation().await?;

            let html = subpage.content().await?;
            let md_raw = HtmlToMarkdown::builder()
                .skip_tags(vec!["script", "style", "header", "footer"])
                .add_handler(vec!["a"], |e: Element| Some(e.content.to_string()))
                .add_handler(vec!["img"], |e: Element| {
                    e.attrs
                        .iter()
                        .find(|a| a.name.local.as_ref() == "alt")
                        .map(|a| format!("![{}]", a.value))
                })
                .build()
                .convert(&html)
                .unwrap();

            let md = md_raw.replace('\u{2028}', "").replace('\u{2029}', "");

            let formatted_name = href
                .trim_start_matches("/give-blood/")
                .trim_end_matches(".html")
                .replace('/', "_")
                .replace('-', "_");

            let filename = format!("{}.md", formatted_name);
            let path = output_dir.join(filename);
            tokio::fs::write(path, md).await?;

            subpage.close().await?;
            count += 1;
        }
    }

    let all_links = page
        .find_elements("ul.cmp-list__container li.cmp-list__item a")
        .await?;

    for link in all_links {
        let Some(href) = link.attribute("href").await? else {
            continue;
        };

        if href != "/give-blood/blood-types.html" {
            let url = format!("https://www.oneblood.org{}", href);

            let subpage = browser.new_page(&url).await?;
            subpage.wait_for_navigation().await?;

            let html = subpage.content().await?;
            let md_raw = HtmlToMarkdown::builder()
                .skip_tags(vec!["script", "style", "header", "footer"])
                .add_handler(vec!["a"], |e: Element| Some(e.content.to_string()))
                .add_handler(vec!["img"], |e: Element| {
                    e.attrs
                        .iter()
                        .find(|a| a.name.local.as_ref() == "alt")
                        .map(|a| format!("![{}]", a.value))
                })
                .build()
                .convert(&html)
                .unwrap();

            let md = md_raw.replace('\u{2028}', "").replace('\u{2029}', "");

            let formatted_name = href
                .trim_start_matches("/give-blood/")
                .trim_end_matches(".html")
                .replace('/', "_")
                .replace('-', "_");

            let filename = format!("{}.md", formatted_name);
            let path = output_dir.join(filename);
            tokio::fs::write(path, md).await?;

            subpage.close().await?;
        }
    }

    let all_links = page
        .find_elements("div.cmp-teaser__action-container a")
        .await?;

    for link in all_links {
        let Some(href) = link.attribute("href").await? else {
            continue;
        };

        if href.starts_with("/give-blood") && href != "/give-blood/blood-types.html" {
            let url = format!("https://www.oneblood.org{}", href);

            let subpage = browser.new_page(&url).await?;
            subpage.wait_for_navigation().await?;

            let html = subpage.content().await?;
            let md_raw = HtmlToMarkdown::builder()
                .skip_tags(vec!["script", "style", "header", "footer"])
                .add_handler(vec!["a"], |e: Element| Some(e.content.to_string()))
                .add_handler(vec!["img"], |e: Element| {
                    e.attrs
                        .iter()
                        .find(|a| a.name.local.as_ref() == "alt")
                        .map(|a| format!("![{}]", a.value))
                })
                .build()
                .convert(&html)
                .unwrap();

            let md = md_raw.replace('\u{2028}', "").replace('\u{2029}', "");

            let formatted_name = href
                .trim_start_matches("/give-blood/blood-types/")
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
