import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAppointmentListComponent } from './widget-appointment-list.component';

describe('WidgetAppointmentListComponent', () => {
  let component: WidgetAppointmentListComponent;
  let fixture: ComponentFixture<WidgetAppointmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetAppointmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAppointmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
