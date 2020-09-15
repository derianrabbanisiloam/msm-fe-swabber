import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetReservationBpjsComponent } from './widget-reservation-bpjs.component';

describe('WidgetReservationBpjsComponent', () => {
  let component: WidgetReservationBpjsComponent;
  let fixture: ComponentFixture<WidgetReservationBpjsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetReservationBpjsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetReservationBpjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
