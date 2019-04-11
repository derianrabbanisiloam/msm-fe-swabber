import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCarComponent } from './page-car.component';

describe('PageCarComponent', () => {
  let component: PageCarComponent;
  let fixture: ComponentFixture<PageCarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
