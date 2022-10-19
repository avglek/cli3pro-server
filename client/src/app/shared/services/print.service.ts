import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  printSubject = new Subject();

  printElement(elementRef: HTMLElement) {
    const printBody = elementRef.cloneNode(true);
    const printWindow = window.open('', '', 'height=400,width=800');
    if (printWindow) {
      this.preparePrintWindow(printWindow);
      printWindow.document.body.appendChild(<Element>printBody);
    }

    return timer(2000).pipe(
      tap(() => {
        if (printWindow) {
          console.log('print:', printWindow);
          printWindow.print();
          printWindow.close();
        }
      })
    );
  }

  preparePrintWindow(printWindow: Window) {
    printWindow.document.write(
      `
      <html>
        <head>
        <link rel="preconnect" href="https://fonts.gstatic.com">
            <link
              href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap"
              rel="stylesheet"
            />
            <link rel="stylesheet" href="styles.css">
        </head>
        <body ></body>
      </html>
    `
    );
  }

}
