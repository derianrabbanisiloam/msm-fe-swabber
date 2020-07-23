import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRescheduleBpjsComponent } from './modal-reschedule-bpjs.component';

describe('ModalRescheduleBpjsComponent', () => {
  let component: ModalRescheduleBpjsComponent;
  let fixture: ComponentFixture<ModalRescheduleBpjsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRescheduleBpjsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRescheduleBpjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
