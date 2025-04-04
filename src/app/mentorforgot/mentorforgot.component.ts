import { Component } from '@angular/core';
 
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-mentorforgot',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './mentorforgot.component.html',
  styleUrl: './mentorforgot.component.css'
})
export class MentorforgotComponent {
  email: string = '';
  // showForgotUsernameForm: boolean = true;
  showUsernameMessage: boolean = false;
  showForgotPasswordForm:boolean = true;
 
  otp: string = '';
  newPassword: string = '';
  showOtpModel: boolean = false;
  passwordValidationMessage: string[] = [];
  otpError: string | null = null;
  constructor(private userService:UserService, private router: Router) {}
 
 
  
 
 
  onSubmit() {
    if (!this.email || !this.email.trim()) {
      alert('Please enter your email.');
      return;
    }
 
    const trimmedEmail = this.email.trim();
    console.log(`Sending OTP to email: ${trimmedEmail}`);
 
    // Call the service to send OTP
    this.userService.mentorSendOtp(trimmedEmail).subscribe({
      next: (response) => {
        console.log(`${response} - ${trimmedEmail}`);
        this.showOtpModel = true;
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error?.error || 'Error sending OTP. Please try again.';
        alert(errorMessage);
      },
    });
  }
 
  onSubmit2() {
    console.log('OTP:', this.otp);
    console.log('New Password:', this.newPassword);
    console.log('Email:', this.email);
 
    if (this.email?.trim() && this.otp?.trim() && this.newPassword?.trim()) {
      this.userService.mentorResetPassword(this.email, this.otp, this.newPassword).subscribe({
        next: (response) => {
          console.log('Password changed successfully!', response);
          alert(response);
          this.router.navigate(['/login']); // Redirect to login page
        },
        error: (error: HttpErrorResponse) => {
          alert(error.error || 'Error changing password. Please try again.');
          console.log(error);
        },
      });
    } else {
      alert('Please fill in all fields.');
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
 
    // Store the OTP value
    this.otp = enteredValue;
  }
 
 
}
 
 