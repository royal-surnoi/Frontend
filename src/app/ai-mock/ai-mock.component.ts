import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';
import { Router, RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-ai-mock',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './ai-mock.component.html',
  styleUrl: './ai-mock.component.css'
})
export class AiMockComponent implements OnInit {
  interviewForm: FormGroup;
  displayCard: boolean = false;
  currentCard: number = 1;
  selectedFile: File | null = null;
  userId: number = Number(localStorage.getItem('id'));
  resumeAvailable: boolean = false;
  resumeFileName: string = '';
  resumeFileUrl: string = '';
  resumeVisible: boolean = false;
  isClicked = false;
  showAssignmentPopup = false;
  assignmentInterviewForm: FormGroup;
  showPopup: boolean = false;
 
 
  constructor(private http: HttpClient, private authService: AuthService, private fb: FormBuilder, private router: Router)  {
 
       // Initialize the Reactive Form
       this.interviewForm = this.fb.group({
        jobRole: ['', Validators.required],
        description: ['', [Validators.required, Validators.minLength(10)]],
        experience: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Only numbers allowed
        resume: [null], // File input, not required initially
      });
 
      this.assignmentInterviewForm = this.fb.group({
        jobRole: ['', Validators.required],
        description: ['', [Validators.required, Validators.minLength(10)]],
        experience: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      });
   
  }
  ngOnInit(): void {
    console.log("userid is", this.userId);
    this.getResume();
  }
 
 
  openPopup() {
    this.showPopup = true;
  }
 
  closePopup() {
    this.showPopup = false;
  }
 
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.resumeAvailable = true;
      this.resumeFileName = file.name;
      this.resumeFileUrl = URL.createObjectURL(file);
      this.resumeVisible = true;
      this.selectedFile = file;
    }
  }
 
 
  uploadResume() {
    this.isClicked = true;
    setTimeout(() => this.isClicked = false, 1000);
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }
 
    const formData = new FormData();
    formData.append('file', this.selectedFile); // Key must match @RequestParam("file")
 
    this.http.post(`http://localhost:8080/personalDetails/${this.userId}/uploadResume`, formData, { responseType: 'text' })
      .subscribe(
        {next:(response) => {
          console.log('Upload success:', response);
          alert(response);
          this.getResume();
        },
        error:(error) => {
          console.error('Upload error:', error);
          alert('Failed to upload resume.');
        }}
      );
  }
 
 
  getResume() {
    this.http.get(`http://localhost:8080/personalDetails/${this.userId}/getResume`, { responseType: 'blob' })
      .subscribe(
        {next:(response) => {
          if (response.size > 0) {
            this.resumeAvailable = true;
            this.resumeFileName = 'resume';
 
            const blob = new Blob([response], { type: 'application/pdf' });
            this.resumeFileUrl = URL.createObjectURL(blob);
          }
        },
        error:(error) => {
          if (error.status === 404) {
            this.resumeAvailable = false;
          }}
        }
      );
  }
 
  submitForm(): void {
    if (this.interviewForm.invalid) {
      alert('Please fill all fields and select a file');
      return;
    }
 
    // Extract form values
    const userId = this.interviewForm.value.userId;
    const role = this.interviewForm.value.jobRole;
    const jobDescription = this.interviewForm.value.description;
    const experienceYears = this.interviewForm.value.experience;
    const resumeFile = this.selectedFile; // File selected separately
 
    if (!resumeFile) {
      alert('Please select a resume file');
      return;
    }
 
    // Call the service
    this.startInterviewserve(userId, role, jobDescription, experienceYears, resumeFile)
      .subscribe({
        next: (response) => console.log('Interview started:', response),
        error: (error) => console.error('Error:', error),
      });
  }
 
 
  startInterviewserve(
    userId: string,
    role: string,
    jobDescription: string,
    experienceYears: number,
    resumeFile: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('role', role);
    formData.append('job_description', jobDescription);
    formData.append('experience_years', experienceYears.toString());
    formData.append('resume', resumeFile);
 
    return this.http.post(environment.apiBaseUrlAI+'/start_interview/', formData);
  }
 
  click() {
    this.router.navigate(['/aiaudio']);
  }
 
  openAssignmentPopup() {
    this.showAssignmentPopup = true;
  }
 
  closeAssignmentPopup() {
    this.showAssignmentPopup = false;
  }
 
  submitAssignmentForm() {
      if (this.assignmentInterviewForm.valid) {
        const { jobRole, description, experience } = this.assignmentInterviewForm.value;
        this.router.navigate(['/aimockquiz', jobRole, description, experience]);
        this.closeAssignmentPopup();
      }
    }
  }
 
 
 
 
 
 