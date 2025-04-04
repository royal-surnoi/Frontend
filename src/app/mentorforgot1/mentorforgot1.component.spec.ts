import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mentorforgot1Component } from './mentorforgot1.component';

describe('Mentorforgot1Component', () => {
  let component: Mentorforgot1Component;
  let fixture: ComponentFixture<Mentorforgot1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mentorforgot1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mentorforgot1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
