import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TFontDictionary } from 'pdfmake/interfaces';
import { checkFileName } from '../utils/str-utils';
import { DocumentGridDefinition } from '../classes/documentGridDefinition';
import { ExcelData } from '../interfaces';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private fonts: TFontDictionary;

  constructor() {
    this.fonts = {
      IBM: {
        normal: `${window.location.origin}/assets/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf`,
      },
      Roboto: {
        normal: `${window.location.origin}/assets/fonts/Roboto/Roboto-Regular.ttf`,
        bold: `${window.location.origin}/assets/fonts/Roboto/Roboto-Medium.ttf`,
      },
      Jura: {
        normal: `${window.location.origin}/assets/fonts/jura/static/Jura-Regular.ttf`,
      },
      Montserrat: {
        normal: `${window.location.origin}/assets/fonts/Montserrat/static/Montserrat-Regular.ttf`,
      },
    };
  }

  openPdf(text: string[]) {
    const documentDefinition = this.getDocumentDefinitionText(text);
    pdfMake.createPdf(documentDefinition, undefined, this.fonts).open();
  }

  downloadPdf(text: string[], name: string) {
    const documentDefinition = this.getDocumentDefinitionText(text);
    const fileName = checkFileName(name) + '.pdf';
    pdfMake
      .createPdf(documentDefinition, undefined, this.fonts)
      .download(fileName);
  }

  printPdf(text: string[]) {
    const documentDefinition = this.getDocumentDefinitionText(text);
    pdfMake.createPdf(documentDefinition, undefined, this.fonts).print();
  }

  openGridPdf(data: ExcelData) {
    const document = new DocumentGridDefinition(data);
    const documentDefinition = document.getDocument();
    pdfMake.createPdf(documentDefinition, undefined, this.fonts).open();
  }

  downloadGridPdf(data: ExcelData, name: string) {
    const document = new DocumentGridDefinition(data);
    const documentDefinition = document.getDocument();
    const fileName = checkFileName(name) + '.pdf';
    pdfMake
      .createPdf(documentDefinition, undefined, this.fonts)
      .download(fileName);
  }

  printGridPdf(data: ExcelData) {
    const document = new DocumentGridDefinition(data);
    const documentDefinition = document.getDocument();
    pdfMake.createPdf(documentDefinition, undefined, this.fonts).print();
  }

  getDocumentDefinitionText(text: string[]) {
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
