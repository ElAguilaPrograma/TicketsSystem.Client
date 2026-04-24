import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Myworkspace } from './myworkspace';

describe('Myworkspace', () => {
  let component: Myworkspace;
  let fixture: ComponentFixture<Myworkspace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Myworkspace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Myworkspace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
