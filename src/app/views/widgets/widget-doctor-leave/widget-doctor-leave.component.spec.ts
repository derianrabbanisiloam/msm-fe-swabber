import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDoctorLeaveComponent } from './widget-doctor-leave.component';

describe('WidgetDoctorLeaveComponent', () => {
  let component: WidgetDoctorLeaveComponent;
  let fixture: ComponentFixture<WidgetDoctorLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetDoctorLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDoctorLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
