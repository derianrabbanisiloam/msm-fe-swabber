import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAppointmentBpjsComponent } from './widget-appointment-bpjs.component';

describe('WidgetAppointmentBpjsComponent', () => {
  let component: WidgetAppointmentBpjsComponent;
  let fixture: ComponentFixture<WidgetAppointmentBpjsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetAppointmentBpjsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAppointmentBpjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
