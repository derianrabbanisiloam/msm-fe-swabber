import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAppointmentListBpjsComponent } from './widget-appointment-list-bpjs.component';

describe('WidgetAppointmentListBpjsComponent', () => {
  let component: WidgetAppointmentListBpjsComponent;
  let fixture: ComponentFixture<WidgetAppointmentListBpjsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetAppointmentListBpjsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAppointmentListBpjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
