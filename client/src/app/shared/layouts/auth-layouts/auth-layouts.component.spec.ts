import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLayoutsComponent } from './auth-layouts.component';

describe('AuthLayotsComponent', () => {
  let component: AuthLayoutsComponent;
  let fixture: ComponentFixture<AuthLayoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthLayoutsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
