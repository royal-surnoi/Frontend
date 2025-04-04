import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-mentorforgot1',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './mentorforgot1.component.html',
  styleUrl: './mentorforgot1.component.css'
})
export class Mentorforgot1Component {
 
  email: string = '';
  showForgotUsernameForm:boolean=true;
  showUsernameMessage: boolean = true;
 
  constructor(private userService:UserService, private router: Router) {}
 
  usernameErrorMessage: string | null = null;
 
  onSubmitUsernameRequest() {
    this.usernameErrorMessage = null; // Reset error message
 
    if (!this.email || !this.email.trim()) {
      this.usernameErrorMessage = 'Please enter your email.';  
      alert(this.usernameErrorMessage); // Show alert for empty email
      return;
    }
 
    const trimmedEmail = this.email.trim();
    console.log(`Requesting username for email: ${trimmedEmail}`);
 
    this.userService.forgotMentorUsername(trimmedEmail).subscribe({
      next: (response: any) => {
        console.log(`Username retrieval response: ${JSON.stringify(response)}`);
 
        // Ensure response is an object and contains a message
        const successMessage = response?.message || 'Username has been sent to your email address.';
 
        // Show success alert
        alert(successMessage);
       
        // Redirect after alert
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // Set error message
        this.usernameErrorMessage = error.error?.message || 'Error retrieving username. Please try again.';
       
        // Show error alert
        alert(this.usernameErrorMessage);
      },
    });
  }
 
 
 
 
 
}
 
 