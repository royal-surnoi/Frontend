import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizlevelComponent } from './quizlevel.component';

describe('QuizlevelComponent', () => {
  let component: QuizlevelComponent;
  let fixture: ComponentFixture<QuizlevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizlevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizlevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
