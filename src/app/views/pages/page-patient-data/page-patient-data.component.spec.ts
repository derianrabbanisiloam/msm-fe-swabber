import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePatientDataComponent } from './page-patient-data.component';

describe('PagePatientDataComponent', () => {
  let component: PagePatientDataComponent;
  let fixture: ComponentFixture<PagePatientDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagePatientDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePatientDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
