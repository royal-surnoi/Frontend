import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagelearningComponent } from './languagelearning.component';

describe('LanguagelearningComponent', () => {
  let component: LanguagelearningComponent;
  let fixture: ComponentFixture<LanguagelearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguagelearningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguagelearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
