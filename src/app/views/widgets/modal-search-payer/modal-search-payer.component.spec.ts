import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSearchPayerComponent } from './modal-search-payer.component';

describe('ModalSearchPayerComponent', () => {
  let component: ModalSearchPayerComponent;
  let fixture: ComponentFixture<ModalSearchPayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSearchPayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSearchPayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
