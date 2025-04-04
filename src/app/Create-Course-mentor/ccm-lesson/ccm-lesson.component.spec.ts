import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcmLessonComponent } from './ccm-lesson.component';

describe('CcmLessonComponent', () => {
  let component: CcmLessonComponent;
  let fixture: ComponentFixture<CcmLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CcmLessonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CcmLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
