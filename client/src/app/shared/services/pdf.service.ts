import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TFontDictionary } from 'pdfmake/interfaces';
import { checkFileName } from '../utils/str-utils';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private fonts: TFontDictionary;

  constructor() {
    // pdfMake.fonts = {
    //   IBM: {
    //     normal: 'fontFile.ttf',
    //     bold: 'fontFile2.ttf',
    //     italics: 'fontFile3.ttf',
    //     bolditalics: 'fontFile4.ttf'
    //   },
    //   Roboto: {
    //     normal: 'fontFile.ttf',
    //     bold: 'fontFile2.ttf',
    //     italics: 'fontFile3.ttf',
    //     bolditalics: 'fontFile4.ttf'
    //   },
    // }
    this.fonts = {
      IBM: {
        normal: 'IBMPlexMono-Regular.ttf',
      },
    };
  }

  openPdf(text: string[]) {
    const documentDefinition = this.getDocumentDefinition(text);
    pdfMake.createPdf(documentDefinition, undefined, this.fonts).open();
  }

  downloadPdf(text: string[], name: string) {
    const documentDefinition = this.getDocumentDefinition(text);
    const fileName = checkFileName(name) + '.pdf';
    pdfMake
      .createPdf(documentDefinition, undefined, this.fonts)
      .download(fileName);
  }

  printPdf(text: string[]) {
    const documentDefinition = this.getDocumentDefinition(text);
    pdfMake.createPdf(documentDefinition, undefined, this.fonts).print();
  }

  getDocumentDefinition(text: string[]) {
    const report = text.join('\n');
    return {
      content: [
        {
          text: report,
          font: 'IBM',
          fontSize: 10,
        },
      ],
    };
  }
}
