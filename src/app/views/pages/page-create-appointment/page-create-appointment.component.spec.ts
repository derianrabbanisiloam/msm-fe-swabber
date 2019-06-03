import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCreateAppointmentComponent } from './page-create-appointment.component';

describe('PageCreateAppointmentComponent', () => {
  let component: PageCreateAppointmentComponent;
  let fixture: ComponentFixture<PageCreateAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCreateAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCreateAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
