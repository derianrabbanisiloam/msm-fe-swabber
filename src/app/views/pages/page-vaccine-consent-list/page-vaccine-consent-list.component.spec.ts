import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVaccineConsentListComponent } from './page-vaccine-consent-list.component';

describe('PageVaccineConsentListComponent', () => {
  let component: PageVaccineConsentListComponent;
  let fixture: ComponentFixture<PageVaccineConsentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageVaccineConsentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageVaccineConsentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
