import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
 
@Component({
  selector: 'app-userforgot',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './userforgot.component.html',
  styleUrl: './userforgot.component.css'
})
export class UserforgotComponent {
 
  email: string = '';
   
    showotpmodel:boolean=false;
 
    constructor(
      private userService: UserService,
     // private http: HttpClient,
      private router: Router
    ) {}
   
    onSubmit() {
      if (!this.email || !this.email.trim()) {
        alert('Please enter your email.');
        return;
      }
   
      const trimmedEmail = this.email.trim();
      console.log(`Sending OTP to email: ${trimmedEmail}`);
   
      // Call the service to send OTP
      this.userService.usersendOtp(trimmedEmail).subscribe({
        next: (response) => {
          console.log(`${response} - ${trimmedEmail}`); 
        this.showotpmodel=true;
        },
        error: (error) => {
          const errorMessage = error?.error || 'Error sending OTP. Please try again.';
          alert(errorMessage);
        },
      });
    }
   
   
   
    otp: string = ''; // OTP input
    newPassword: string = '';
passwordValidationMessage: string[] = [];
otpError: string | null = null;
 
 
onSubmit2() {
  console.log('otp:', this.otp);
  console.log('newPassword:', this.newPassword);
  console.log('email:', this.email); // Ensure email is set
 
  if (this.email?.trim() && this.otp?.trim() && this.newPassword?.trim()) {
    this.userService.userresetPassword(this.email, this.otp, this.newPassword).subscribe({
      next: (response) => {
        console.log('Password changed successfully!', response);
        alert(response);
        this.router.navigate(['/login']); // Redirect to login page
      },
      error: (error) => {
        alert(error.error || 'Error changing password. Please try again.');
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
  if (!/\d/.test(password)) { // Using '\d' instead of '[0-9]'
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
 
 