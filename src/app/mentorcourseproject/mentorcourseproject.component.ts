import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FusionService } from '../fusion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mentorcourseproject',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './mentorcourseproject.component.html',
  styleUrl: './mentorcourseproject.component.css'
})
export class MentorcourseprojectComponent implements OnInit{

  selectedFile: File | null = null;
  projectForm!: FormGroup;
  teacherId: any;
  courseId: any;
  today: Date = new Date(); // Declare and initialize 'today'
  maxYear: number = 3000; // Define the maximum allowed year
  fileError: string = '';

  minDateValidator(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Let required validator handle empty values
      }
      const controlDate = new Date(control.value);
      return controlDate >= minDate 
        ? null 
        : { minDate: { actual: control.value, min: minDate.toISOString().split('T')[0] } };
    };
  }

  dateOrderValidator(formGroup: FormGroup): ValidationErrors | null {
    const startDateValue = formGroup.get('startDate')?.value;
    const deadlineValue = formGroup.get('projectDeadline')?.value;
    const reviewDateValue = formGroup.get('reviewMeetDate')?.value;
  
    if (startDateValue && deadlineValue && reviewDateValue) {
      const startDate = new Date(startDateValue);
      const projectDeadline = new Date(deadlineValue);
      const reviewMeetDate = new Date(reviewDateValue);
  
      if (projectDeadline < startDate) {
        return { deadlineBeforeStart: true };
      }
      if (reviewMeetDate < projectDeadline) {
        return { reviewBeforeDeadline: true };
      }
    }
    return null;
  }

  maxYearValidator(maxYear: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Let required validator handle empty values
      }
      const controlDate = new Date(control.value);
      // Check if the year of the date is greater than maxYear
      if (controlDate.getFullYear() > maxYear) {
        return { maxYear: { actual: controlDate.getFullYear(), max: maxYear } };
      }
      return null;
    };
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (allowedTypes.includes(file.type)) {
        this.selectedFile = file;  // Accept valid file
        this.fileError = '';       // Clear any previous error
      } else {
        this.selectedFile = null;  // Reject invalid file
        this.fileError = 'Only PDF or Word files (.pdf, .doc, .docx) are allowed.';
      }
    }
  }

  constructor(
    private fusionService: FusionService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.projectForm = this.fb.group({
      projectTitle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      projectDescription: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1500)]],
      gitUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      startDate: ['', [Validators.required, this.minDateValidator(this.today), this.maxYearValidator(this.maxYear)]],
      projectDeadline: ['', [Validators.required , this.maxYearValidator(this.maxYear)]],
      reviewMeetDate: ['', [Validators.required , this.maxYearValidator(this.maxYear)]]
    }, { validators: this.dateOrderValidator }); // Attach the form-level validator);
       // Get teacherId from local storage
       const storedTeacherId = localStorage.getItem('id');
       if (storedTeacherId) {
         this.teacherId = +storedTeacherId;
       }

      // Get studentId from route parameters
    this.courseId = +this.route.snapshot.paramMap.get('courseId')!;
  }
  navigateToDashboard(): void {
    this.router.navigate(['/mentorperspective']);
  }


  onSubmit(): void {
    // Check if form is valid and file is selected
    if (this.projectForm.invalid || !this.selectedFile) {
      this.projectForm.markAllAsTouched();
      // Optionally, if file is required, you can set fileError if it's missing
      if (!this.selectedFile) {
        this.fileError = 'Project Document is required.';
      }
      return;
    }
  
    const formData = new FormData();
    formData.append('projectTitle', this.projectForm.get('projectTitle')?.value);
    formData.append('projectDescription', this.projectForm.get('projectDescription')?.value);
    formData.append('gitUrl', this.projectForm.get('gitUrl')?.value);
    formData.append('projectDeadline', this.projectForm.get('projectDeadline')?.value);
    formData.append('startDate', this.projectForm.get('startDate')?.value);
    formData.append('reviewMeetDate', this.projectForm.get('reviewMeetDate')?.value);
    formData.append('projectDocument', this.selectedFile);
  
    this.fusionService.createProjectcourse(this.teacherId, this.courseId, formData).subscribe(
      {next:response => {
        console.log('Project created successfully', response);
        alert('Project created successfully');
        this.router.navigate(['/mentorperspective']);
      },
      error:error => {
        console.error('Error creating project', error);
        alert('Error creating project');
      }}
    );
  }
  

}