import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAppointmentBpjsComponent } from './modal-appointment-bpjs.component';

describe('ModalAppointmentBpjsComponent', () => {
  let component: ModalAppointmentBpjsComponent;
  let fixture: ComponentFixture<ModalAppointmentBpjsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAppointmentBpjsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAppointmentBpjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
