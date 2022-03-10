import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSwabListComponent } from './widget-swab-list.component';

describe('WidgetSwabListComponent', () => {
  let component: WidgetSwabListComponent;
  let fixture: ComponentFixture<WidgetSwabListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetSwabListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetSwabListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
