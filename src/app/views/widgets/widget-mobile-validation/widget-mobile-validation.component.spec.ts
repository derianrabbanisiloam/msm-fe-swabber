import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMobileValidationComponent } from './widget-mobile-validation.component';

describe('WidgetMobileValidationComponent', () => {
  let component: WidgetMobileValidationComponent;
  let fixture: ComponentFixture<WidgetMobileValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetMobileValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetMobileValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
