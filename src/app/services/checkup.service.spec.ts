import { TestBed } from '@angular/core/testing';

import { CheckupService } from './checkup.service';

describe('CheckupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckupService = TestBed.get(CheckupService);
    expect(service).toBeTruthy();
  });
});
