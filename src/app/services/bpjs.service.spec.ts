import { TestBed } from '@angular/core/testing';

import { BpjsService } from './bpjs.service';

describe('BpjsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BpjsService = TestBed.get(BpjsService);
    expect(service).toBeTruthy();
  });
});
