import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-admin-signup',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './admin-signup.component.html',
  styleUrls: ['./admin-signup.component.css']
})
export class AdminSignupComponent {
  registerForm: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialize the form using FormBuilder
    this.registerForm = this.fb.group(
      {
        jobAdminCompanyName: [
          '',
          [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[A-Za-z\s]+$/)]
        ],
        jobAdminName: [
          '',
          [Validators.required, Validators.minLength(3), Validators.maxLength(30)]
        ],
        role: ['', [Validators.required]],
        jobAdminEmail: ['', [Validators.required, Validators.email]],
        jobAdminPassword: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ]],
        jobAdminConfirmPassword: ['', [Validators.required]]
      },
      { validators: this.mustMatch('jobAdminPassword', 'jobAdminConfirmPassword') }
    );
  }

  // Custom validator to match passwords
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }

      return null;
    };
  }

 
  onSubmit() {
    if (this.registerForm.valid) {
      const payload = this.registerForm.value; // Directly get form values
 
      console.log(payload, "Payload"); // For debugging
 
     
      this.http.post(`${environment.apiBaseUrl}/jobAdmin/register?jobAdminName=${payload.jobAdminName}&role=${payload.role}&jobAdminCompanyName=${payload.jobAdminCompanyName}&jobAdminEmail=${payload.jobAdminEmail}&jobAdminPassword=${payload.jobAdminPassword}&jobAdminConfirmPassword=${payload.jobAdminConfirmPassword}`,"" ).subscribe({
        next: (res) => {
          console.log('Response:', res);
          this.router.navigate(['/JobAdminLogin']); // Navigate only on success
        },
        error: (err) => {
          console.error('Error:', err);
          alert('Failed to register. Please try again.');
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(field => {
        const control = this.registerForm.get(field);
        if (control) {
          control.markAsTouched();
        }
      });
      // Display an alert or message if the form is invalid
      alert('Please fill out the form correctly before submitting.');
    }
  }
}
 
 