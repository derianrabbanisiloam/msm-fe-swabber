import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetRequestListComponent } from './widget-request-list.component';

describe('WidgetRequestListComponent', () => {
  let component: WidgetRequestListComponent;
  let fixture: ComponentFixture<WidgetRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
