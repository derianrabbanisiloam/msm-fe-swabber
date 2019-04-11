import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCarsComponent } from './widget-cars.component';

describe('WidgetCarsComponent', () => {
  let component: WidgetCarsComponent;
  let fixture: ComponentFixture<WidgetCarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetCarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
