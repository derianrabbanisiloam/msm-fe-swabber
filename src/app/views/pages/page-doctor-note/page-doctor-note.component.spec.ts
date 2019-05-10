import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDoctorNoteComponent } from './page-doctor-note.component';

describe('PageDoctorNoteComponent', () => {
  let component: PageDoctorNoteComponent;
  let fixture: ComponentFixture<PageDoctorNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageDoctorNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDoctorNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
