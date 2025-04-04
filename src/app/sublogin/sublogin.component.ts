 
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubauthService } from '../subauth.service';
 
@Component({
  selector: 'app-sublogin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sublogin.component.html',
  styleUrls: ['./sublogin.component.css']
})
export class SubloginComponent implements OnInit, OnDestroy {
  loginData = {
    username: '',
    password: ''
  };
  errorMessage: string = '';
  private subscription: Subscription = new Subscription();
  showPassword: boolean = false;
  showDetails: boolean = false;
  apiBaseUrl: string = environment.apiBaseUrl;
  showForgotPopup:boolean = false;
 
  // New properties for popup
  showPopup: boolean = false;
  loginStatus: any;
 
  constructor(
    private router: Router,
    private http: HttpClient,
    private subauthService: SubauthService
  ) {}
 
  ngOnInit(): void {
    this.playVideo();
  }
 
  playVideo() {
    const videoElement = document.getElementById('background-video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.play().catch((error) => {
        console.error('Error trying to play the video:', error);
      });
    }
  }
 
  onSubmit(): void {
    this.errorMessage = ''; // Reset error message
 
    // Validate input fields
    if (!this.loginData.username && !this.loginData.password) {
      this.errorMessage = 'Please enter both email/username and password.';
      return;
    }
    if (!this.loginData.username) {
      this.errorMessage = 'Please enter your email/username.';
      return;
    }
    if (!this.loginData.password) {
      this.errorMessage = 'Please enter your password.';
      return;
    }
 
    const data = { email: this.loginData.username, password: this.loginData.password };
    console.log("Attempting to login with:", data);
 
    this.subscription.add(
      this.subauthService.login(this.loginData.username, this.loginData.password).subscribe({
        next: (response: any) => {
          console.log('Login Response:', response);
          const { token, username, mentorId } = response;
          localStorage.setItem('mentorToken', token);
          localStorage.setItem('mentorUsername', username);
          localStorage.setItem('mentorId', mentorId.toString());
          localStorage.setItem('mentorLoggedIn', 'true');
          this.loginStatus = 'success';
          this.showPopup = true;
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.log(error.error)
            this.errorMessage = 'Invalid username or password. Please try again.';
          } else if (error.status === 404) {
            console.log(error.error)
            this.errorMessage = 'User not found. Please enter valid username.';
          } else {
            console.log(error.error)
            this.errorMessage = error.error + " Please enter valid password";
          }
          this.loginStatus = 'failed';
          this.showPopup = true;
        }
      })
    );
  }
 
 
  navigateToHrRegister(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/subregister']);
  }
 
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
 
  closePopup(): void {
    this.showPopup = false;
    if (this.loginStatus === 'success') {
      this.router.navigate(['/mentorperspective']);
    }
  }
 
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navigateToForgotusernamepassword(event: Event) {
    event.preventDefault(); // Prevents default link behavior
    this.showForgotPopup = true; // Opens the popup
  }
 
  closeForgotPopup() {
    this.showForgotPopup = false; // Closes the popup
  }
 
  onForgotUsername() {
    this.showForgotPopup = false;
    this.router.navigate(['/mentorforgot1']); // Navigate to Forgot Username page
  }
 
  onForgotPassword() {
    this.showForgotPopup = false;
    this.router.navigate(['/mentorforgot']); // Navigate to Forgot Password page
  }
}
 
 