import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageViewQuotaComponent } from './page-view-quota.component';

describe('PageViewQuotaComponent', () => {
  let component: PageViewQuotaComponent;
  let fixture: ComponentFixture<PageViewQuotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageViewQuotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageViewQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
