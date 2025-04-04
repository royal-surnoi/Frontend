import { TestBed } from '@angular/core/testing';

import { AcadamicTeacherServiceService } from './acadamic-teacher-service.service';

describe('AcadamicTeacherServiceService', () => {
  let service: AcadamicTeacherServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcadamicTeacherServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
