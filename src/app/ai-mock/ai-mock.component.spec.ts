import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiMockComponent } from './ai-mock.component';

describe('AiMockComponent', () => {
  let component: AiMockComponent;
  let fixture: ComponentFixture<AiMockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiMockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
