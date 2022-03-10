import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSwabListComponent } from './page-swab-list.component';

describe('PageSwabListComponent', () => {
  let component: PageSwabListComponent;
  let fixture: ComponentFixture<PageSwabListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSwabListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSwabListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
