import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSearchPatientComponent } from './modal-search-patient.component';

describe('ModalSearchPatientComponent', () => {
  let component: ModalSearchPatientComponent;
  let fixture: ComponentFixture<ModalSearchPatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSearchPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSearchPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
