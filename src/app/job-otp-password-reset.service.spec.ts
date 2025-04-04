import { TestBed } from '@angular/core/testing';

import { JobOtpPasswordResetService } from './job-otp-password-reset.service';

describe('JobOtpPasswordResetService', () => {
  let service: JobOtpPasswordResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobOtpPasswordResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
