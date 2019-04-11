import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetFoodsDetailComponent } from './widget-foods-detail.component';

describe('WidgetFoodsDetailComponent', () => {
  let component: WidgetFoodsDetailComponent;
  let fixture: ComponentFixture<WidgetFoodsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetFoodsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetFoodsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
