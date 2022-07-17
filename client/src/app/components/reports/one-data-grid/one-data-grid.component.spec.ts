import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneDataGridComponent } from './one-data-grid.component';

describe('OneDataGridComponent', () => {
  let component: OneDataGridComponent;
  let fixture: ComponentFixture<OneDataGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneDataGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
