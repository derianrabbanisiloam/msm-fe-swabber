import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetFoodsComponent } from './widget-foods.component';

describe('WidgetFoodsComponent', () => {
  let component: WidgetFoodsComponent;
  let fixture: ComponentFixture<WidgetFoodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetFoodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetFoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
