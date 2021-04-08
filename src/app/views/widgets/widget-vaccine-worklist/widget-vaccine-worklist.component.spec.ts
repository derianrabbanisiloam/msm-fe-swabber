import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetVaccineWorklistComponent } from './widget-vaccine-worklist.component';

describe('WidgetVaccineWorklistComponent', () => {
  let component: WidgetVaccineWorklistComponent;
  let fixture: ComponentFixture<WidgetVaccineWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetVaccineWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetVaccineWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
