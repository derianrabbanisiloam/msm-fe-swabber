import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPatientRegistrationComponent } from './modal-patient-registration.component';

describe('ModalPatientRegistrationComponent', () => {
  let component: ModalPatientRegistrationComponent;
  let fixture: ComponentFixture<ModalPatientRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPatientRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPatientRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
