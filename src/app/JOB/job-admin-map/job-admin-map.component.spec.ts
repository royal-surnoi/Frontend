import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAdminMapComponent } from './job-admin-map.component';

describe('JobAdminMapComponent', () => {
  let component: JobAdminMapComponent;
  let fixture: ComponentFixture<JobAdminMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobAdminMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobAdminMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
