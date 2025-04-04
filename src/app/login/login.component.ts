import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  private subscription: Subscription = new Subscription();
  showPassword: boolean = false;
  showDetails: boolean = false;
  apiBaseUrl: string = environment.apiBaseUrl;
  showPopup: boolean = false;
  loginStatus: 'success' | 'failed' | null = null;
 
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}
 
  ngOnInit() {
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
 
  login() {
    const data = { email: this.email, password: this.password };
 
    if (!this.email) {
      this.errorMessage = 'Please enter your email/username.';
      return;
    } else if (!this.password) {
      this.errorMessage = 'Please enter your password.';
      return;
    }
 
    this.errorMessage = '';
 
    const headers = new HttpHeaders({
      'Device-Name': 'MyDevice',
      'Device-Type': 'Desktop',
      'Device-Model': 'Browser'
    });
 
    this.subscription.add(
      this.http.post(`${this.apiBaseUrl}/user/login`, data, { headers }).subscribe({
        next: (response: any) => {
          const { token, id, name } = response;
          window.localStorage.setItem('token', token);
          window.localStorage.setItem('name', name);
          window.localStorage.setItem('id', id);
 
          this.authService.setLoggedIn(true);
          this.authService.setName(name);
 
          this.loginStatus = 'success';
          this.showPopup = true;
          this.requestLocationAfterLogin(id);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error || 'An unexpected error occurred. Please try again later.';
          this.loginStatus = 'failed';
          this.showPopup = false;
        }
      })
    );
  }
 
  requestLocationAfterLogin(userId: string) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
 
          console.log('Location retrieved successfully:', latitude, longitude,userId);
 
          this.updateUserLocation(userId, latitude, longitude);
          this.router.navigate(['/candidateview/home'], { queryParams: { lat: latitude, lng: longitude } });
        },
        (error) => {
          console.error('Error retrieving location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
 
  updateUserLocation(userId: string, latitude: number, longitude: number) {
    const locationData = { latitude, longitude };
 
    this.http.post(`${this.apiBaseUrl}/personalDetails/location?userId=${userId}`, locationData)
    .subscribe({
      next: (response) => {
        console.log('User location updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating user location:', error);
      }
    });
  
  }
 
  startLocationAutoUpdate(userId: string) {
    setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Auto-updating location:', latitude, longitude);
            this.updateUserLocation(userId, latitude, longitude);
          },
          (error) => {
            console.error('Error retrieving location during auto-update:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    }, 21600000);
  }
 
  closePopup(): void {
    this.showPopup = false;
    if (this.loginStatus === 'success') {
      this.router.navigate(['/candidateview/home'], { queryParams: { requireUserDetails: 'true' } });
    }
  }
 
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
 
  navigateToHrRegister(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/register']);
  }
 
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToForgotPassword(event:Event) {
    event.preventDefault();
    this.router.navigate(['/user-forgot-password']);
  }
}
 
 