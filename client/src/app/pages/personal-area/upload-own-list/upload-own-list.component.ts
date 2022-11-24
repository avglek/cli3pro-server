import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-upload-own-list',
  templateUrl: './upload-own-list.component.html',
  styleUrls: ['./upload-own-list.component.less'],
})
export class UploadOwnListComponent {
  uploading = false;
  fileList: NzUploadFile[] = [];

  constructor(private http: HttpClient) {}

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload(): void {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    // You can use any AJAX library you like
    const req = new HttpRequest(
      'POST',
      'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      formData,
      {
        // reportProgress: true
      }
    );
    this.http
      .request(req)
      .pipe(filter((e) => e instanceof HttpResponse))
      .subscribe({
        next: () => {
          this.uploading = false;
          this.fileList = [];
        },
        error: (err) => {
          this.uploading = false;
        },
      });
  }
}
