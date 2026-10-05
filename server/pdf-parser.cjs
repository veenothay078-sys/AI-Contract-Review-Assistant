module.exports = async function parsePDF(buffer) {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    
    const dataArray = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({ 
      data: dataArray,
      standardFontDataUrl: './node_modules/pdfjs-dist/standard_fonts/',
      disableFontFace: true, // Don't try to load fonts for rendering since we just want text
    });
    
    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    let fullText = '';
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    
    return { text: fullText };
};
