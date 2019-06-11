import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRescheduleAppointmentComponent } from './modal-reschedule-appointment.component';

describe('ModalRescheduleAppointmentComponent', () => {
  let component: ModalRescheduleAppointmentComponent;
  let fixture: ComponentFixture<ModalRescheduleAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRescheduleAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRescheduleAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
