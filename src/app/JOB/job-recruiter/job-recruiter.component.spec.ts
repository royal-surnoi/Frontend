import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobRecruiterComponent } from './job-recruiter.component';

describe('JobRecruiterComponent', () => {
  let component: JobRecruiterComponent;
  let fixture: ComponentFixture<JobRecruiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobRecruiterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
