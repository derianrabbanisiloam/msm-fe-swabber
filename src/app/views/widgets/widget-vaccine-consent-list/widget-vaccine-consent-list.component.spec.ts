import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetVaccineConsentListComponent } from './widget-vaccine-consent-list.component';

describe('WidgetVaccineConsentListComponent', () => {
  let component: WidgetVaccineConsentListComponent;
  let fixture: ComponentFixture<WidgetVaccineConsentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetVaccineConsentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetVaccineConsentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
