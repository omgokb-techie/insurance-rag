// backend/extract.js
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const pdfParse = require('pdf-parse');

const HTML_PATH = './data/raw_html/page.html';
const PDF_DIR = './data/pdfs';
const OUTPUT_FILE = './data/extracted_text/combined.txt';

async function extractHTMLText() {
  try {
    const html = fs.readFileSync(HTML_PATH, 'utf-8');
    const $ = cheerio.load(html);
    return $('body').text().replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('Error extracting HTML text:', error.message);
    return '';
  }
}

async function extractPDFText() {
  try {
    const files = fs.readdirSync(PDF_DIR);
    let content = '';
    
    for (const file of files) {
      try {
        console.log(`Processing PDF: ${file}`);
        const filePath = path.join(PDF_DIR, file);
        
        // Check if file exists and is readable
        if (!fs.existsSync(filePath)) {
          console.error(`File not found: ${filePath}`);
          continue;
        }

        const data = fs.readFileSync(filePath);
        
        // Basic validation of PDF structure
        if (!data.toString('utf8', 0, 5).includes('%PDF-')) {
          console.error(`Invalid PDF header in file: ${file}`);
          continue;
        }

        const pdf = await pdfParse(data);
        content += `\n\n=== PDF: ${file} ===\n\n`;
        content += pdf.text;
        console.log(`Successfully processed: ${file}`);
      } catch (error) {
        console.error(`Error processing PDF ${file}:`, error.message);
        // Continue with next file instead of failing completely
        continue;
      }
    }
    return content;
  } catch (error) {
    console.error('Error in extractPDFText:', error.message);
    return '';
  }
}

(async () => {
  try {
    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Starting text extraction...');
    const htmlText = await extractHTMLText();
    const pdfText = await extractPDFText();
    
    const combinedText = htmlText + '\n\n' + pdfText;
    fs.writeFileSync(OUTPUT_FILE, combinedText);
    console.log('Text extraction completed successfully');
  } catch (error) {
    console.error('Fatal error during text extraction:', error.message);
    process.exit(1);
  }
})();
