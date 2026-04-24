import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketMain } from './ticket-main';

describe('TicketMain', () => {
  let component: TicketMain;
  let fixture: ComponentFixture<TicketMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
