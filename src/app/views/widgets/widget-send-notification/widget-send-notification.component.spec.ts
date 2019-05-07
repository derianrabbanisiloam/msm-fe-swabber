import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSendNotificationComponent } from './widget-send-notification.component';

describe('WidgetSendNotificationComponent', () => {
  let component: WidgetSendNotificationComponent;
  let fixture: ComponentFixture<WidgetSendNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetSendNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetSendNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
