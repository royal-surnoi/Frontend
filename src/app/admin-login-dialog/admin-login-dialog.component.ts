import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login-dialog',
  standalone: true,
  imports: [ReactiveFormsModule,MatDialogModule,MatButtonModule,MatFormField,MatError,MatLabel,CommonModule],
  templateUrl: './admin-login-dialog.component.html',
  styleUrl: './admin-login-dialog.component.css'
})
export class AdminLoginDialogComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    private dialogRef: MatDialogRef<AdminLoginDialogComponent>
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }
 
  onSubmit() {
    if (this.loginForm.valid) {
      const payload = this.loginForm.value;
 
      this.http.post<any>(`${environment.apiBaseUrl}/jobAdmin/login?jobAdminEmail=${payload.email}&jobAdminPassword=${payload.password}`, "")
        .subscribe({
          next: (res) => {
            console.log('Response:', res);
            if (res.id) {
              localStorage.setItem('adminId', res.id);
              this.dialogRef.close({ success: true, adminId: res.id });
            }
          },
          error: (err) => {
            console.error('Error:', err);
            this.errorMessage = 'Invalid login credentials';
          }
        });
    }
  }
  onSignup() {
    // Close the dialog and navigate to signup page
    this.dialogRef.close();
    this.router.navigate(['/JobAdminSignup']);
  }
 
  onCancel() {
    this.dialogRef.close({ success: false });
  }
  // ------------------------
 
 
}
