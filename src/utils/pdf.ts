// src/utils/pdfUtils.ts
import * as pdfjsLib from 'pdfjs-dist';

// Configura o Worker para usar o CDN da versão 3.11.174 (Estável)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export async function convertPdfToImages(file: File): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Carrega o documento
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const images: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    // Scale 2.0 ou 3.0 melhora a nitidez no telão VR
    const viewport = page.getViewport({ scale: 2.0 }); 
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (context) {
      // Renderiza a página no canvas
      await page.render({ canvasContext: context, viewport }).promise;
      // Converte para Base64 (imagem)
      images.push(canvas.toDataURL('image/jpeg'));
    }
  }
  return images;
}