import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetRescheduleWorklistComponent } from './widget-reschedule-worklist.component';

describe('WidgetRescheduleWorklistComponent', () => {
  let component: WidgetRescheduleWorklistComponent;
  let fixture: ComponentFixture<WidgetRescheduleWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetRescheduleWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetRescheduleWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
