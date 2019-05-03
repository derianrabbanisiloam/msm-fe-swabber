import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetViewQuotaComponent } from './widget-view-quota.component';

describe('WidgetViewQuotaComponent', () => {
  let component: WidgetViewQuotaComponent;
  let fixture: ComponentFixture<WidgetViewQuotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetViewQuotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetViewQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
