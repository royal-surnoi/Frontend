import { TestBed } from '@angular/core/testing';

import { JobForgotpasswordService } from './job-forgotpassword.service';

describe('JobForgotpasswordService', () => {
  let service: JobForgotpasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobForgotpasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
