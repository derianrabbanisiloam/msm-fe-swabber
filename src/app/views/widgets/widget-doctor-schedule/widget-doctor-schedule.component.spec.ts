import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDoctorScheduleComponent } from './widget-doctor-schedule.component';

describe('WidgetDoctorScheduleComponent', () => {
  let component: WidgetDoctorScheduleComponent;
  let fixture: ComponentFixture<WidgetDoctorScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetDoctorScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDoctorScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
