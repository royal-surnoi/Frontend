import { TestBed } from '@angular/core/testing';

import { AcadamicInstituteServiceService } from './acadamic-institute-service.service';

describe('AcadamicInstituteServiceService', () => {
  let service: AcadamicInstituteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcadamicInstituteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
