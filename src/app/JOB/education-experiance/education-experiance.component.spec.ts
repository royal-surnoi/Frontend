import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationExperianceComponent } from './education-experiance.component';

describe('EducationExperianceComponent', () => {
  let component: EducationExperianceComponent;
  let fixture: ComponentFixture<EducationExperianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationExperianceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationExperianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
