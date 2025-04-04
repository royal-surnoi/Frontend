import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpPasswordResetComponent } from './otp-password-reset.component';

describe('OtpPasswordResetComponent', () => {
  let component: OtpPasswordResetComponent;
  let fixture: ComponentFixture<OtpPasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpPasswordResetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
