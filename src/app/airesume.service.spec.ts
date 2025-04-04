import { TestBed } from '@angular/core/testing';

import { AiresumeService } from './airesume.service';

describe('AiresumeService', () => {
  let service: AiresumeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiresumeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
