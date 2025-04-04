import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiMockQuizComponent } from './ai-mock-quiz.component';

describe('AiMockQuizComponent', () => {
  let component: AiMockQuizComponent;
  let fixture: ComponentFixture<AiMockQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiMockQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiMockQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
