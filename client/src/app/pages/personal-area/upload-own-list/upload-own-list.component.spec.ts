import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOwnListComponent } from './upload-own-list.component';

describe('UploadOwnListComponent', () => {
  let component: UploadOwnListComponent;
  let fixture: ComponentFixture<UploadOwnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadOwnListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadOwnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
