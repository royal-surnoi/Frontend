import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelfeedbackComponent } from './levelfeedback.component';

describe('LevelfeedbackComponent', () => {
  let component: LevelfeedbackComponent;
  let fixture: ComponentFixture<LevelfeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelfeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelfeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
