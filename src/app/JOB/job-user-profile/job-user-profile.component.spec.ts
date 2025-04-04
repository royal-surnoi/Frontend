import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobUserProfileComponent } from './job-user-profile.component';

describe('JobUserProfileComponent', () => {
  let component: JobUserProfileComponent;
  let fixture: ComponentFixture<JobUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobUserProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
