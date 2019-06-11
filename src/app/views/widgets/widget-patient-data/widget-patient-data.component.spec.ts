import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetPatientDataComponent } from './widget-patient-data.component';

describe('WidgetPatientDataComponent', () => {
  let component: WidgetPatientDataComponent;
  let fixture: ComponentFixture<WidgetPatientDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetPatientDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetPatientDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
