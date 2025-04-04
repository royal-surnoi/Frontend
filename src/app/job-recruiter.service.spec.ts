import { TestBed } from '@angular/core/testing';

import { JobRecruiterService } from './job-recruiter.service';

describe('JobRecruiterService', () => {
  let service: JobRecruiterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobRecruiterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
