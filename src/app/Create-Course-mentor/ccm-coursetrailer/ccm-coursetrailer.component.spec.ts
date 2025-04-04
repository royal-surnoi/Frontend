import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcmCoursetrailerComponent } from './ccm-coursetrailer.component';

describe('CcmCoursetrailerComponent', () => {
  let component: CcmCoursetrailerComponent;
  let fixture: ComponentFixture<CcmCoursetrailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CcmCoursetrailerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CcmCoursetrailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
