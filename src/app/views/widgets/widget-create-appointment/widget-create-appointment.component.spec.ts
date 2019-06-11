import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCreateAppointmentComponent } from './widget-create-appointment.component';

describe('WidgetCreateAppointmentComponent', () => {
  let component: WidgetCreateAppointmentComponent;
  let fixture: ComponentFixture<WidgetCreateAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCreateAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCreateAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
