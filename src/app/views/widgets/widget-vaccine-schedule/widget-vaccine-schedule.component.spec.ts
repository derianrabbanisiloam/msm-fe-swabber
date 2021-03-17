import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetVaccineScheduleComponent } from './widget-vaccine-schedule.component';

describe('WidgetVaccineScheduleComponent', () => {
  let component: WidgetVaccineScheduleComponent;
  let fixture: ComponentFixture<WidgetVaccineScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetVaccineScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetVaccineScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
