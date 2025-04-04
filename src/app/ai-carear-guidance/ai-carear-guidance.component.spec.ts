import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiCarearGuidanceComponent } from './ai-carear-guidance.component';

describe('AiCarearGuidanceComponent', () => {
  let component: AiCarearGuidanceComponent;
  let fixture: ComponentFixture<AiCarearGuidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiCarearGuidanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiCarearGuidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
