import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePreRegistrationComponent } from './page-pre-registration.component';

describe('PagePreRegistrationComponent', () => {
  let component: PagePreRegistrationComponent;
  let fixture: ComponentFixture<PagePreRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagePreRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePreRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
