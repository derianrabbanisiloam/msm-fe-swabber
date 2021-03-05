import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetPreRegistrationComponent } from './widget-pre-registration.component';

describe('WidgetPreRegistrationComponent', () => {
  let component: WidgetPreRegistrationComponent;
  let fixture: ComponentFixture<WidgetPreRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetPreRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetPreRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
