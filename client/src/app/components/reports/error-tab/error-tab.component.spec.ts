import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorTabComponent } from './error-tab.component';

describe('ErrorTabComponent', () => {
  let component: ErrorTabComponent;
  let fixture: ComponentFixture<ErrorTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
