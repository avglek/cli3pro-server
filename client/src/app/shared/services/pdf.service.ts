import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TFontDictionary } from 'pdfmake/interfaces';
import { checkFileName } from '../utils/str-utils';
import { ColumnApi, GridApi } from 'ag-grid-community';

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

    // }
    this.fonts = {
      IBM: {
        normal: `${window.location.origin}/assets/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf`,
      },
      Roboto: {
        normal: `${window.location.origin}/assets/fonts/Roboto/Roboto-Regular.ttf`,
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

  openGridPdf(data: any, gridAip: GridApi, columnApi: ColumnApi) {
    const documentDefinition = this.getGridDefinition(data, gridAip, columnApi);
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

  getGridDefinition(data: any, gridAip: GridApi, columnApi: ColumnApi) {
    const content = {
      content: [
        {
          text: 'Пример шрифта "Roboto"',
        },
        {
          text: 'Пример шрифта "Jura"',
          font: 'Jura',
          fontSize: 10,
        },
        {
          text: 'Пример шрифта "Montserrat"',
          font: 'Montserrat',
          fontSize: 10,
        },
      ],
      defaultStyle: {
        font: 'Roboto',
        fontSize: 15,
      },
    };
    return content;
  }
}
