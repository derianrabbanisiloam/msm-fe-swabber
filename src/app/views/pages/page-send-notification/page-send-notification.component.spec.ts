import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSendNotificationComponent } from './page-send-notification.component';

describe('PageSendNotificationComponent', () => {
  let component: PageSendNotificationComponent;
  let fixture: ComponentFixture<PageSendNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSendNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSendNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
