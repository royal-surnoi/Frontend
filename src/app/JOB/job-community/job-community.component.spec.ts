import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCommunityComponent } from './job-community.component';

describe('JobCommunityComponent', () => {
  let component: JobCommunityComponent;
  let fixture: ComponentFixture<JobCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCommunityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
