import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tree2Component } from './tree2.component';

describe('Tree2Component', () => {
  let component: Tree2Component;
  let fixture: ComponentFixture<Tree2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tree2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tree2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
