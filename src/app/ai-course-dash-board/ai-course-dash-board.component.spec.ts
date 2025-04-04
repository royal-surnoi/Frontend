import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AICourseDashBoardComponent } from './ai-course-dash-board.component';

describe('AICourseDashBoardComponent', () => {
  let component: AICourseDashBoardComponent;
  let fixture: ComponentFixture<AICourseDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AICourseDashBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AICourseDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
