import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorforgotComponent } from './mentorforgot.component';

describe('MentorforgotComponent', () => {
  let component: MentorforgotComponent;
  let fixture: ComponentFixture<MentorforgotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorforgotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorforgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
