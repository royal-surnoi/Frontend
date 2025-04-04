import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
 
@Component({
  selector: 'app-recruiter-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './recruiter-login.component.html',
  styleUrl: './recruiter-login.component.css'
})
export class RecruiterLoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
 
  constructor(private router: Router,private http: HttpClient) {}
 
  ngOnInit() {
    // Initialize the form in ngOnInit
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }
 
  Login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Form submitted with values:', this.loginForm.value);
     
      this.http.post(`http://localhost:8080/api/recruiters/login?recruiterEmail=${email}&recruiterPassword=${password}`, "")
        .subscribe({
          next: (response: any) => {
            if (response) {
              console.log('Login successful:', response);
              // You might want to store the response data in localStorage or a service
              localStorage.setItem('recruiterId', JSON.stringify(response.id));
              localStorage.setItem('JobRecruiterToken', JSON.stringify(response.token));
              this.router.navigate(['/JobRecruiter']);
            } else {
              this.errorMessage = 'Invalid response from server';
            }
          },
          error: (error) => {
            console.error('Login failed:', error);
            if (error.status === 401) {
              this.errorMessage = 'Invalid email or password';
            } else if (error.status === 404) {
              this.errorMessage = 'Recruiter not found';
            } else {
              this.errorMessage = 'An error occurred during login. Please try again later.';
            }
          },
          complete: () => {
            console.log('Login request completed');
          }
        });
    } else {
      console.log('Form is invalid', this.loginForm.errors);
      this.errorMessage = 'Please fill in all required fields correctly';
    }
  }
}
 
 