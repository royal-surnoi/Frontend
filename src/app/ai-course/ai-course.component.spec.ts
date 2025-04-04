import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AICourseComponent } from './ai-course.component';

describe('AICourseComponent', () => {
  let component: AICourseComponent;
  let fixture: ComponentFixture<AICourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AICourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AICourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
