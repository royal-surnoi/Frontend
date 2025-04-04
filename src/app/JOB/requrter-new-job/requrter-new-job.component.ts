import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule,ReactiveFormsModule, AbstractControlOptions, ValidationErrors, AbstractControl , Validators } from '@angular/forms';
import { Job, JobAdmin, JobRecruiterService } from '../../job-recruiter.service';
import { CommonModule } from '@angular/common';

 
 
@Component({
  selector: 'app-requrter-new-job',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './requrter-new-job.component.html',
  styleUrl: './requrter-new-job.component.css'
})
export class RequrterNewJobComponent {
  jobForm: FormGroup;
  recruiterId: number | null = null;
  jobAdmin: JobAdmin | null = null;
  errorMessage: string | null = null;
  isLoading = false;



  constructor(private fb: FormBuilder, private jobService: JobRecruiterService) {
    this.jobForm = this.fb.group(
      {
        jobTitle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        jobDescription: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1500)]],
        basicJobQualification: [''],
        primaryRoles: [''],
        mainResponsibilities: [''],
        requiredSkills: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
        location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        minSalary: ['', [Validators.required, Validators.min(0), Validators.max(20000000)]],
        maxSalary: ['', [Validators.required, Validators.min(0), Validators.max(20000000)]],
        jobType: ['', Validators.required],
        vacancyCount: ['', [Validators.required, Validators.min(0), Validators.max(10000)]],
        requiredEducation: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        requiredEducationStream: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        requiredPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
        requiredPassoutYear: ['', [Validators.required, Validators.min(1900), Validators.max(9999)]],
        requiredWorkExperience: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
        numberOfLevels: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
      },
      { validators: this.maxSalaryValidator } as AbstractControlOptions
    );
  }

  maxSalaryValidator(control: AbstractControl): ValidationErrors | null {
    const minSalary = control.get('minSalary')?.value;
    const maxSalary = control.get('maxSalary')?.value;

    if (minSalary && maxSalary && minSalary > maxSalary) {
      return { maxSalaryError: true };
    }

    return null;
  }

 
  ngOnInit(): void {
    const recruiterId = localStorage.getItem('recruiterId');
    if (recruiterId) {
      this.recruiterId = +recruiterId;
      this.fetchAdminData(this.recruiterId);
    } else {
      this.errorMessage = 'Recruiter ID not found in local storage';
    }
  }
 
  fetchAdminData(recruiterId: number): void {
    this.jobService.getAdminByRecruiterId(recruiterId).subscribe(
      {next:(data: JobAdmin) =>
      {
        this.jobAdmin = data;
      console.log(this.jobAdmin);
      }
      ,
      error:(error) => {
        this.errorMessage = 'Error fetching admin data';
        console.error('Error:', error);
      }}
    );
  }
 
  // onSubmit(): void {
  //   if (this.jobForm.invalid) {
  //     alert("Fill All Details!!!")
  //     return;
  //   }
 
  //   const job: Job = this.jobForm.value;
  //   const adminId = this.jobAdmin?.id;
 
  //   if (adminId && this.recruiterId) {
  //     this.jobService.createJob(adminId, this.recruiterId, job).subscribe(
  //       {next:(response) => {
  //         console.log('Job created successfully:', response);
  //         alert("Job Created Successfully!!")
  //         this.jobForm.reset();
  //       },
  //       error:(error) => {
  //         this.errorMessage = 'Error creating job';
  //         console.error('Error:', error);
  //       }}
  //     );
  //   } else {
  //     this.errorMessage = 'Admin ID or Recruiter ID is missing';
  //   }
  // }

  // onSubmit(): void {
  //   if (this.jobForm.invalid) {
  //     alert("Fill All Details!!!");
  //     return;
  //   }
  
  //   this.isLoading = true; // Show loader when form submission starts
  
  //   const job: Job = this.jobForm.value;
  //   const adminId = this.jobAdmin?.id;
  
  //   if (adminId && this.recruiterId) {
  //     this.jobService.createJob(adminId, this.recruiterId, job).subscribe({
  //       next: (response) => {
  //         console.log('Job created successfully:', response);
  //         alert("Job Created Successfully!!");
  //         this.jobForm.reset();
  //         this.isLoading = false; // Hide loader on success
  //       },
  //       error: (error) => {
  //         this.errorMessage = 'Error creating job';
  //         console.error('Error:', error);
  //         this.isLoading = false; // Hide loader on error
  //       }
  //     });
  //   } else {
  //     this.errorMessage = 'Admin ID or Recruiter ID is missing';
  //     this.isLoading = false; // Hide loader if IDs are missing
  //   }
  // }

  // onSubmit(): void {
  //   if (this.jobForm.invalid) {
  //     alert("Fill All Details!!!");
  //     return;
  //   }
  
  //   this.isLoading = true; // Show loader when form submission starts
  
  //   const job: Job = this.jobForm.value;
  //   const adminId = this.jobAdmin?.id;
  
  //   if (adminId && this.recruiterId) {
  //     this.jobService.createJob(adminId, this.recruiterId, job).subscribe({
  //       next: (response) => {
  //         console.log('Job created successfully:', response);
  //         alert("Job Created Successfully!!");
  //         this.jobForm.reset();
  //         this.jobForm.markAsPristine();
  //         this.jobForm.markAsUntouched();
  //         this.isLoading = false; // Hide loader on success
  //       },
  //       error: (error) => {
  //         this.errorMessage = 'Error creating job';
  //         console.error('Error:', error);
  //         this.isLoading = false; // Hide loader on error
  //       }
  //     });
  //   } else {
  //     this.errorMessage = 'Admin ID or Recruiter ID is missing';
  //     this.isLoading = false; // Hide loader if IDs are missing
  //   }
  // }


  onSubmit(): void {
    if (this.jobForm.invalid) {
      alert("Fill All Details!!!");
      return;
    }
  
    this.isLoading = true; // Show loader when form submission starts
  
    const job: Job = this.jobForm.value;
    const adminId = this.jobAdmin?.id;
  
    if (adminId && this.recruiterId) {
      this.jobService.createJob(adminId, this.recruiterId, job).subscribe({
        next: (response) => {
          console.log('Job created successfully:', response);
          alert("Job Created Successfully!!");
          this.jobForm.reset();
          this.jobForm.markAsPristine();
          this.jobForm.markAsUntouched();
          
          
          // Clear contenteditable divs manually
          const mainResponsibilitiesDiv = document.getElementById('mainResponsibilities');
          if (mainResponsibilitiesDiv) {
            mainResponsibilitiesDiv.innerText = '';
          }
  
          const primaryRolesDiv = document.getElementById('primaryRoles');
          if (primaryRolesDiv) {
            primaryRolesDiv.innerText = '';
          }
  
          const basicJobQualificationDiv = document.getElementById('basicJobQualification');
          if (basicJobQualificationDiv) {
            basicJobQualificationDiv.innerText = '';
          }
  
          this.isLoading = false; // Hide loader on success
        },
        error: (error) => {
          this.errorMessage = 'Error creating job';
          console.error('Error:', error);
          this.isLoading = false; // Hide loader on error
        }
      });
    } else {
      this.errorMessage = 'Admin ID or Recruiter ID is missing';
      this.isLoading = false; // Hide loader if IDs are missing
    }
  }
  

  

  
  
 
  
  
  
  
 
  execCommand(command: string, fieldName: string): void {
    const editor = document.getElementById(`editor-${fieldName}`) as HTMLElement;
    editor?.focus();
 
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let tagName: string;
 
        switch (command) {
            case 'bold':
                tagName = 'strong';
                break;
            case 'italic':
                tagName = 'em';
                break;
            case 'underline':
                tagName = 'u';
                break;
            case 'insertUnorderedList':
                // Create a list item and wrap the selected text in it
                const li = document.createElement('li');
                li.appendChild(range.extractContents());
 
                // Check if the parent is already a list item
                let parentListItem = range.commonAncestorContainer.parentElement?.closest('li');
                let ul: HTMLUListElement | null = null;
 
                if (parentListItem) {
                    // If already in a list item, just update the content
                    parentListItem.appendChild(li);
                } else {
                    // Otherwise, create a new unordered list and add the list item
                    ul = document.createElement('ul');
                    ul.appendChild(li);
                    range.insertNode(ul);
                }
 
                // Move the selection to the end of the new list item
                const newRange = document.createRange();
                newRange.setStartAfter(li);
                newRange.setEndAfter(li);
                selection.removeAllRanges();
                selection.addRange(newRange);
                return;
            // Add more cases as needed
            default:
                return;
        }
 
        const tag = document.createElement(tagName);
        tag.appendChild(range.extractContents());
        range.insertNode(tag);
        selection.removeAllRanges();
    }
}
 
 
  // Method to change font size
  changeFontSize(action: string, fieldName: string): void {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString() : '';
    if (selectedText && selection) {
      const span = document.createElement('span');
      span.style.fontSize = action === 'increase' ? 'larger' : 'smaller';
      span.textContent = selectedText;
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);
      selection.removeAllRanges();
    }
  }
 
 // Change text color
 changeColor(event: Event, fieldName: string): void {
  const selectElement = event.target as HTMLSelectElement;
  const color = selectElement.value;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.color = color;
      span.appendChild(range.extractContents());
      range.insertNode(span);
      selection.removeAllRanges();
  }
}
 
  // Update the form control with editor content
  updateField(fieldName: string): void {
    const editor = document.getElementById(`${fieldName}`);
    const editorContent = editor ? editor.innerHTML : '';
    this.jobForm.controls[fieldName].setValue(editorContent);
  }
 
  blockNegativeInput(event: KeyboardEvent): void {
    // Prevent entering the '-' symbol
    if (event.key === '-') {
      event.preventDefault();
    }
  }
 
  sanitizeMinSalary(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
 
    // Remove any invalid characters, including '-', and ensure it's not negative
    if (value.includes('-') || Number(value) < 0) {
      value = value.replace('-', '');
      input.value = value;
      this.jobForm.get('minSalary')?.setValue(Number(value));
    }
  }
 
  sanitizeMaxSalary(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
 
    // Remove any invalid characters, including '-', and ensure it's not negative
    if (value.includes('-') || Number(value) < 0) {
      value = value.replace('-', '');
      input.value = value;
      this.jobForm.get('maxSalary')?.setValue(Number(value));
    }
  }
}