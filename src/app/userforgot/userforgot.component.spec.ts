import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserforgotComponent } from './userforgot.component';

describe('UserforgotComponent', () => {
  let component: UserforgotComponent;
  let fixture: ComponentFixture<UserforgotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserforgotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserforgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
