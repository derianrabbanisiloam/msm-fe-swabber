import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPatientVerificationComponent } from './modal-patient-verification.component';

describe('ModalPatientVerificationComponent', () => {
  let component: ModalPatientVerificationComponent;
  let fixture: ComponentFixture<ModalPatientVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPatientVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPatientVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
