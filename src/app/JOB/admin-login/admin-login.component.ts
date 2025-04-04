import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
 
@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  isAdminLogin = false;
  loginForm!: FormGroup;
  errorMessage: string = '';
 
  constructor(private router: Router, private http: HttpClient) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }
 
  onSubmit() {
    const payload = this.loginForm.value;
 
    this.http.post<any>(`${environment.apiBaseUrl}/jobAdmin/login?jobAdminEmail=${payload.email}&jobAdminPassword=${payload.password}`,"")
      .subscribe({
        next: (res) => {
          console.log('Response:', res);
 
          if (res.id) {
            localStorage.setItem('adminId', res.id);
            localStorage.setItem('JobAdminToken', res.token);
            this.isAdminLogin = true;
            console.log(this.isAdminLogin)
            this.router.navigate(['/JobAdmin']);
          }
        },
        error: (err) => {
          console.error('Error:', err);
          this.errorMessage = 'Invalid login credentials';
        }
      });
  }

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
 
 