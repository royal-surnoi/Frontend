import { TestBed } from '@angular/core/testing';

import { AcadamicStudentServiceService } from './acadamic-student-service.service';

describe('AcadamicStudentServiceService', () => {
  let service: AcadamicStudentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcadamicStudentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
