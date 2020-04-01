import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAidoWorklistComponent } from './widget-aido-worklist.component';

describe('WidgetAidoWorklistComponent', () => {
  let component: WidgetAidoWorklistComponent;
  let fixture: ComponentFixture<WidgetAidoWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetAidoWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAidoWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
