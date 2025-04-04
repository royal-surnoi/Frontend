import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobOtpPasswordResetService } from '../../job-otp-password-reset.service';
 
@Component({
  selector: 'app-otp-password-reset',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './otp-password-reset.component.html',
  styleUrls: ['./otp-password-reset.component.css'],
})
export class OtpPasswordResetComponent {
  jobAdminEmail: string = ''; // User will manually enter their email here
  otp: string = ''; // OTP input
  newPassword: string = '';
  passwordValidationMessage: string[] = [];
  otpError: string | null = null;
 
  constructor(private router: Router, private otpPasswordResetService: JobOtpPasswordResetService) {}
 
  onSubmit() {
    console.log('jobAdminEmail:', this.jobAdminEmail);
    console.log('otp:', this.otp);
    console.log('newPassword:', this.newPassword);
    console.log(this.otp);
 
    if (this.jobAdminEmail?.trim() && this.otp?.trim() && this.newPassword?.trim()) {
      const requestBody = {
        jobAdminEmail: this.jobAdminEmail,
        adminOtp: parseInt(this.otp, 10),
        newPassword: this.newPassword,
      };
 
      this.otpPasswordResetService.resetPassword(requestBody).subscribe({
        next: (response) => {
          console.log('Password changed successfully!', response);
          alert(response);
         
          this.router.navigate(['/JobAdminLogin']); // Redirect to login page
        },
        error: (error) => {
          alert(error.error);
          console.log(error);
        },
      });
    } else {
      alert('Please fill in all fields');
    }
  }
 
 
  validatePassword(password: string): void {
    this.passwordValidationMessage = [];
    if (!/[A-Z]/.test(password)) {
      this.passwordValidationMessage.push('Must include an uppercase letter.');
    }
    if (!/[a-z]/.test(password)) {
      this.passwordValidationMessage.push('Must include a lowercase letter.');
    }
    if (!/\d/.test(password)) {
      this.passwordValidationMessage.push('Must include a number.');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      this.passwordValidationMessage.push('Must include a special character.');
    }
    if (password.length < 8 || password.length > 20) {
      this.passwordValidationMessage.push('Must be between 8 and 20 characters.');
    }
  }
 
 
  onOtpInput(event: any) {
    const input = event.target as HTMLInputElement;
    const enteredValue = input.value;
 
    // Allow only numeric input
    if (!/^\d*$/.test(enteredValue)) {
      input.value = enteredValue.replace(/\D/g, ''); // Remove non-digit characters
      this.otpError = 'Only numbers are allowed.';
      return;
    }
 
    // Clear error if input is valid
    this.otpError = null;
 
    // If needed, store the OTP value
    this.otp = enteredValue;
  }
 
 
}
 
 