// backend/scraper.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const BASE_URL = 'https://www.allianz.co.uk/insurance/car-insurance.html'; // replace with real site
const PDF_DIR = path.join(__dirname, '../data/pdfs');
const HTML_DIR = path.join(__dirname, '../data/raw_html');

// Ensure directories exist
[PDF_DIR, HTML_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

async function downloadPDF(page, url, filename) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(`Processing PDF link: ${url}`);

            const base64Data = await page.evaluate(async (url) => {
                const response = await fetch(url);
                const blob = await response.blob();
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]);
                    reader.readAsDataURL(blob);
                });
            }, url);

            const buffer = Buffer.from(base64Data, 'base64');
            const filePath = path.join(PDF_DIR, filename);
            fs.writeFileSync(filePath, buffer);
            console.log(`Successfully downloaded PDF: ${filename}`);
            resolve();
        } catch (error) {
            console.error(`Failed to download ${filename}:`, error.message);
            reject(error);
        }
    });
}

async function scrapeSite() {
    let browser;
    try {
        // Launch browser with additional arguments to make it look more like a real user
        browser = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920x1080',
            ]
        });

        const page = await browser.newPage();

        page.setDefaultNavigationTimeout(120000); // 2 minutes
        page.setDefaultTimeout(120000);

        // Set a realistic viewport and user agent
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Enable request interception to monitor network traffic
        await page.setRequestInterception(true);
        page.on('request', request => {
            request.continue();
        });

        // Navigate to the page and wait for it to load
        console.log('Navigating to page...');
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

        // Save the HTML content
        const content = await page.content();
        fs.writeFileSync(path.join(HTML_DIR, 'page.html'), content);

        // Find and download PDFs
        const pdfLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href$=".pdf"]'));
            return links.map(link => ({
                url: link.href,
                filename: link.href.split('/').pop()
            }));
        });

        console.log(`Found ${pdfLinks.length} PDFs to download`);

        for (const { url, filename } of pdfLinks) {
            console.log(`Attempting to download: ${filename}`);
            await downloadPDF(page, url, filename);
        }

        console.log('Scraping completed successfully');
    } catch (error) {
        console.error('Scraping failed:', error.message);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

scrapeSite();
