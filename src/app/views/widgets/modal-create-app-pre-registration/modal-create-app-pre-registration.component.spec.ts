import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateAppPreRegistrationComponent } from './modal-create-app-pre-registration.component';

describe('ModalCreateAppPreRegistrationComponent', () => {
  let component: ModalCreateAppPreRegistrationComponent;
  let fixture: ComponentFixture<ModalCreateAppPreRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCreateAppPreRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateAppPreRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
