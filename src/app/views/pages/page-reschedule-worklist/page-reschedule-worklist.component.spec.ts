import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRescheduleWorklistComponent } from './page-reschedule-worklist.component';

describe('PageRescheduleWorklistComponent', () => {
  let component: PageRescheduleWorklistComponent;
  let fixture: ComponentFixture<PageRescheduleWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageRescheduleWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRescheduleWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
