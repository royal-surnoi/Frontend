import { TestBed } from '@angular/core/testing';

import { JobAdminService } from './job-admin.service';

describe('JobAdminService', () => {
  let service: JobAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
