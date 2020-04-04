import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerificationAidoComponent } from './modal-verification-aido.component';

describe('ModalVerificationAidoComponent', () => {
  let component: ModalVerificationAidoComponent;
  let fixture: ComponentFixture<ModalVerificationAidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalVerificationAidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVerificationAidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
