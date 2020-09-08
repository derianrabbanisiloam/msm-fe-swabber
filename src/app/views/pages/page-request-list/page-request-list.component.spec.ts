import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRequestListComponent } from './page-request-list.component';

describe('PageRequestListComponent', () => {
  let component: PageRequestListComponent;
  let fixture: ComponentFixture<PageRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
