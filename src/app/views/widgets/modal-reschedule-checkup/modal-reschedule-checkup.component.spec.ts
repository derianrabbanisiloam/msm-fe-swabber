import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRescheduleCheckupComponent } from './modal-reschedule-checkup.component';

describe('ModalRescheduleCheckupComponent', () => {
  let component: ModalRescheduleCheckupComponent;
  let fixture: ComponentFixture<ModalRescheduleCheckupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRescheduleCheckupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRescheduleCheckupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
