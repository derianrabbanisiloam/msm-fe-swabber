import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetBaseAppointmentComponent } from './widget-base-appointment.component';

describe('WidgetBaseAppointmentComponent', () => {
  let component: WidgetBaseAppointmentComponent;
  let fixture: ComponentFixture<WidgetBaseAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetBaseAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetBaseAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
