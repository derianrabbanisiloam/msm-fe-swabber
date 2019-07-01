import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMobileValidationComponent } from './page-mobile-validation.component';

describe('PageMobileValidationComponent', () => {
  let component: PageMobileValidationComponent;
  let fixture: ComponentFixture<PageMobileValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageMobileValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageMobileValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
