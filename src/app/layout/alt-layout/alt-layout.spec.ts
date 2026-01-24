import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltLayout } from './alt-layout';

describe('AltLayout', () => {
  let component: AltLayout;
  let fixture: ComponentFixture<AltLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
