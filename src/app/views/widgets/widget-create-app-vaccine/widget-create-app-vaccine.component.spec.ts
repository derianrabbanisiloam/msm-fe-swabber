import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCreateAppVaccineComponent } from './widget-create-app-vaccine.component';

describe('WidgetCreateAppVaccineComponent', () => {
  let component: WidgetCreateAppVaccineComponent;
  let fixture: ComponentFixture<WidgetCreateAppVaccineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCreateAppVaccineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCreateAppVaccineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
