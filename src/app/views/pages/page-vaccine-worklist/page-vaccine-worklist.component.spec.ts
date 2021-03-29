import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVaccineWorklistComponent } from './page-vaccine-worklist.component';

describe('PageVaccineWorklistComponent', () => {
  let component: PageVaccineWorklistComponent;
  let fixture: ComponentFixture<PageVaccineWorklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageVaccineWorklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageVaccineWorklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
