import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCancelAppointmentComponent } from './modal-cancel-appointment.component';

describe('ModalCancelAppointmentComponent', () => {
  let component: ModalCancelAppointmentComponent;
  let fixture: ComponentFixture<ModalCancelAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCancelAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCancelAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
