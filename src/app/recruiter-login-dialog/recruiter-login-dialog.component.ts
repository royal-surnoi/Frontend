import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-recruiter-login-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,MatDialogModule,MatButtonModule,MatFormFieldModule,MatInputModule,CommonModule],
  templateUrl: './recruiter-login-dialog.component.html',
  styleUrl: './recruiter-login-dialog.component.css'
})
export class RecruiterLoginDialogComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
 
  constructor(
    private http: HttpClient,
    private router: Router,
    private dialogRef: MatDialogRef<RecruiterLoginDialogComponent>
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }
 
 
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
 
      this.http.post<any>(`${environment.apiBaseUrl}/recruiters/login?recruiterEmail=${email}&recruiterPassword=${password}`, "")
        .subscribe({
          next: (response) => {
            if (response && response.id) {
              localStorage.setItem('recruiterId', response.id);
              this.dialogRef.close({ success: true, recruiterId: response.id });
              this.router.navigate(['/JobRecruiter']);
            }
          },
          error: (err) => {
            console.error('Login Error:', err);
            if (err.status === 401) {
              this.errorMessage = 'Invalid email or password';
            } else if (err.status === 404) {
              this.errorMessage = 'Recruiter not found';
            } else {
              this.errorMessage = 'An error occurred during login. Please try again later.';
            }
          }
        });
    }
  }
 
  onCancel() {
    this.dialogRef.close({ success: false });
  }
}
