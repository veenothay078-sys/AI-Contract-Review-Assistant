import fs from 'fs';
import PDFDocument from 'pdfkit';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

// 1. Create a simple PDF
const doc = new PDFDocument();
const pdfPath = './simple-test.pdf';
doc.pipe(fs.createWriteStream(pdfPath));

doc.fontSize(20).text('EMPLOYMENT OFFER LETTER', { align: 'center' });
doc.moveDown();
doc.fontSize(12).text('Candidate: John Doe');
doc.text('Position: Software Developer');
doc.text('Annual CTC: ₹6,00,000');
doc.text('Joining Date: 1 September 2026');
doc.text('Probation: 6 months');
doc.text('Notice Period: 30 days');
doc.text('Confidentiality: The employee shall maintain strict confidentiality.');
doc.end();

// Wait a bit for the file stream to finish writing
setTimeout(async () => {
  console.log(`\n--- TESTING PDF EXTRACTION ---`);
  try {
    const buffer = fs.readFileSync(pdfPath);
    console.log(`Buffer size: ${buffer.length} bytes`);
    
    const dataArray = new Uint8Array(buffer);
    const loadingTask = getDocument({ data: dataArray });
    const pdfDocument = await loadingTask.promise;
    console.log(`PDF parsed successfully. Pages found: ${pdfDocument.numPages}`);
    
    let fullText = '';
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += `--- Page ${i} ---\n${pageText}\n\n`;
    }
    
    console.log(`Extracted Text:\n${fullText}`);
    console.log(`Length: ${fullText.length}`);
  } catch (err) {
    console.error('PDF Extraction Error:', err);
  }
}, 1000);
