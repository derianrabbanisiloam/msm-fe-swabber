import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBaseAppointmentComponent } from './page-base-appointment.component';

describe('PageBaseAppointmentComponent', () => {
  let component: PageBaseAppointmentComponent;
  let fixture: ComponentFixture<PageBaseAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageBaseAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBaseAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
