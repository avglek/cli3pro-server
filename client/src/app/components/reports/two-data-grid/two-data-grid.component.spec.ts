import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoDataGridComponent } from './two-data-grid.component';

describe('TwoDataGridComponent', () => {
  let component: TwoDataGridComponent;
  let fixture: ComponentFixture<TwoDataGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoDataGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
