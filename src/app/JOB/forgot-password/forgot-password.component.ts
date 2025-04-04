import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobForgotpasswordService } from '../../job-forgotpassword.service';
 
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email: string = ''; // Holds the email input from the user
 
  constructor(
    private forgotPasswordService: JobForgotpasswordService,
    private router: Router
  ) {}
 
  onSubmit() {
    if (this.email.trim()) {
      // Call the service to send OTP
      this.forgotPasswordService.sendOtp(this.email).subscribe({
        next: (response) => {
          console.log(`${response} - ${this.email}`);
          alert(response);
          // Navigate to the OTP password reset page without passing email
          this.router.navigate(['/otp-password-reset']);
        },
        error: (error) => {
          const errorMessage =
            error.error || 'Error sending OTP. Please try again.';
          alert(errorMessage);
        },
      });
    } else {
      alert('Please enter your email.');
    }
 
  }
}
 
 