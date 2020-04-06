import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAidoWorklistComponent } from './page-aido-worklist.component';

describe('PageAidoWorklistComponent', () => {
  let component: PageAidoWorklistComponent;
  let fixture: ComponentFixture<PageAidoWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageAidoWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAidoWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
