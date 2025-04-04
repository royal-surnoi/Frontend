import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OtpService } from '../otp.service';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
 
@Component({
  selector: 'app-enrollment-payment-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ToastModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './enrollment-payment-form.component.html',
  styleUrl: './enrollment-payment-form.component.css',
  providers: [MessageService]
})
export class EnrollmentPaymentFormComponent implements OnInit {
  studid: any;
  isEmailLoading = true;
  email = '';
  otpForm: FormGroup;
  verifyForm: FormGroup;
  isGeneratingOtp = false;
  isVerifyingOtp = false;
  courseId!:number;
 
  constructor(
    private fb: FormBuilder,
    private otpService: OtpService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required],
      id: ['', Validators.required],
      courseId: ['', Validators.required]
    });
    this.otpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
 
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const courseId = params['courseId'];
      this.courseId = +params['courseId'];
      this.verifyForm.patchValue({ courseId: courseId });
    });
    this.fetchCandidateDetails();
  }
 
  fetchCandidateDetails(): void {
    const studid = window.localStorage.getItem('id');
    if (studid) {
      this.employeeService.getbyid(studid).subscribe(
        {next:(data: any) => {
          this.email = data.email;
          this.isEmailLoading = false;
 
          this.otpForm.patchValue({ email: this.email });
          this.verifyForm.patchValue({
            email: this.email,
            id: data.id
          });
        },
        error:(error: any) => {
          this.isEmailLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch candidate details'
          });
        }}
      );
    } else {
      this.isEmailLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No Candidate ID found'
      });
    }
  }
 
  generateOtp(): void {
    this.isGeneratingOtp = true;
    this.otpService.generateOtp(this.email).subscribe(
     {next:response => {
        this.isGeneratingOtp = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'OTP has been sent to your email'
        });
      },
      error:error => {
        this.isGeneratingOtp = false;
        if (error.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'OTP has been sent to your email'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to generate OTP'
          });
        }
      }}
    );
  }
 
  onSubmit(): void {
    if (this.verifyForm.valid) {
      this.isVerifyingOtp = true;
      const formData = this.verifyForm.value;
      this.otpService.verifyOtp(formData.email, formData.otp, formData.id, formData.courseId).subscribe(
        {next:response => {
          this.isVerifyingOtp = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'OTP Verified Successfully'
          });
          this.router.navigate(['/followcount']);
        },
        error:error => {
          this.isVerifyingOtp = false;
          if (error.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully logged in'
            });
            this.router.navigate(['/coursedashboard',this.courseId]);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to verify OTP'
            });
          }
        }}
      );
    }
  }
}
 