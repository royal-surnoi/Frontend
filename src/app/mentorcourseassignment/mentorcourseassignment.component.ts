import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FusionService } from '../fusion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-mentorcourseassignment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './mentorcourseassignment.component.html',
  styleUrl: './mentorcourseassignment.component.css'
})
export class MentorcourseassignmentComponent  implements OnInit {
 
selectedFile: File | null = null;
fileError: string = '';
  minDateTime: string = '';
  minEndDate: string = '';
  minReviewDate: string = '';
 
 
  assignmentForm!: FormGroup;
  // selectedFile: File | null = null;
  teacherId: any;
  courseId: any;
  constructor(
    private fb: FormBuilder,
    private fusionService: FusionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }
  ngOnInit(): void {
    this.assignmentForm = this.fb.group({
      assignmentTitle:  [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(50)]
      ],
      assignmentTopicName: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(500)]
      ],
      assignmentDescription: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(500)]
      ],
      maxScore: [
        '',
        [
          Validators.required,
          Validators.min(0),  // Prevents negative values
          Validators.max(100)  // Set your desired max limit
        ]
      ],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reviewMeetDate: ['', Validators.required],
      // assignmentAnswer: ['', Validators.required],
    });
       // Get teacherId from local storage
       const storedTeacherId = localStorage.getItem('id');
       if (storedTeacherId) {
         this.teacherId = +storedTeacherId;
       }
 
      // Get studentId from route parameters
    this.courseId = +this.route.snapshot.paramMap.get('courseId')!;
    this.setMinDateTime();
  }
 
  navigateToDashboard(): void {
    this.router.navigate(['/mentorperspective']);
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
 
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
 
      if (allowedTypes.includes(file.type)) {
        this.selectedFile = file;  // Accept valid file
        this.fileError = ''; // Clear any previous error
      } else {
        this.selectedFile = null;  // Reject invalid file
        this.fileError = 'Only PDF or Word files (.pdf, .doc, .docx) are allowed.';
      }
    }
  }
 
 
  onSubmit(): void {
    if (this.assignmentForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('assignmentTitle', this.assignmentForm.get('assignmentTitle')!.value);
      formData.append('assignmentTopicName', this.assignmentForm.get('assignmentTopicName')!.value);
      formData.append('assignmentDescription', this.assignmentForm.get('assignmentDescription')!.value);
      formData.append('maxScore', this.assignmentForm.get('maxScore')!.value);
      formData.append('startDate', this.assignmentForm.get('startDate')!.value);
      formData.append('endDate', this.assignmentForm.get('endDate')!.value);
      formData.append('reviewMeetDate', this.assignmentForm.get('reviewMeetDate')!.value);
      // formData.append('assignmentAnswer', this.assignmentForm.get('assignmentAnswer')!.value);
      formData.append('assignmentDocument', this.selectedFile);
 
      this.fusionService.createAssignmentCourse(this.teacherId, this.courseId, formData)
        .subscribe(
          {next:response => {
          console.log('Assignment created successfully', response);
          alert('Assignment created successfully');
                 // Navigate to the MentorPerspectiveComponent after success
        this.router.navigate(['/mentorperspective']);
        }, error:(error) => {
          console.error('Error creating assignment', error);
          alert('Error creating assignment');
        }
        });
    }
  }
 
 
 
  setMinDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for timezone
    this.minDateTime = now.toISOString().slice(0, 16);
    this.minEndDate = this.minDateTime;
    this.minReviewDate = this.minDateTime;
  }
 
  updateEndDateMin() {
    const startDate = this.assignmentForm.get('startDate')?.value;
    if (startDate) {
      this.minEndDate = startDate;
      this.assignmentForm.get('endDate')?.setValue('');
      this.assignmentForm.get('reviewMeetDate')?.setValue('');
    }
  }
 
  updateReviewDateMin() {
    const endDate = this.assignmentForm.get('endDate')?.value;
    if (endDate) {
      this.minReviewDate = endDate;
      this.assignmentForm.get('reviewMeetDate')?.setValue('');
    }
  }
}
 
 
 