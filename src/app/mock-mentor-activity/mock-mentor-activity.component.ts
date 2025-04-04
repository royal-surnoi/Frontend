import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule ,FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MockService } from '../mock.service';
import { Router } from '@angular/router';
 
 
 
interface Course {
  id: number;
  courseTitle: string;
}
interface Slot {
  slotName: string;
  slotTime: Date;
  endTime: Date;
}
interface Assignment {
  assignment_id: string;
  title: string;
  submittedAt: number[]; // Assuming this is the structure
  // Add other relevant properties
}
interface Project {
  project_id: string;
  title: string;
  submittedAt: number[]; // Assuming this is the structure
  // Add other relevant properties
}
@Component({
  selector: 'app-mock-mentor-activity',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './mock-mentor-activity.component.html',
  styleUrl: './mock-mentor-activity.component.css'
})
export class MockMentorActivityComponent implements OnInit {
 
  mockTestCreated = false;  // Initially set to false
  formType: string | null = null; // 'options', 'test', or 'interview'
  selectedTestType: string | null = null; // 'QUIZ', 'ASSIGNMENT', or 'PROJECT'
  testSlots: Slot[] = [];
  interviewSlots: Slot[] = [];
  testImage: string | ArrayBuffer | null = 'assets/default-image.png';
  interviewImage: string | ArrayBuffer | null = 'assets/default-image.png';
  courses: Course[] = [];
  mockTestDetails: any = null;
  mockInterviewDetails: any = null;
  titleError: string | null = null;
  descriptionError: string | null = null;
  relatedCourseIdError: string | null = null;
  feeError: string | null = null;
  freeAttemptsError: string | null = null;
  testTypeError: string | null = null;
  imageError: string | null = null;
 
  projectForm: FormGroup = new FormGroup({});
  enrolledStudents: any[] = []; // Initialize with an empty array or fetch data from a service
  selectedStudents: any[] = []; // To track selected students
  userId:any;
  constructor(private mockService: MockService, private fb: FormBuilder,private router:Router) {
    this.interviewForm = this.fb.group({
      interviewName: [''],
      interviewTime: ['']
    });
    this.assignmentForm = this.fb.group({
      title: [''],
      topicName: [''],
      description: [''],
      document: [null]
    });
 
 
  }
 
  ngOnInit(): void {
    this.getSubmissions();
    this.userId = this.getUserIdFromLocalStorage(); // Adjust this method as needed
    this.fetchCourses();
    this.initializeForm();
 
    this.projectForm = this.fb.group({
      projectTitle: ['', Validators.required],
      // Add other form controls as needed
    });
 
   
  }
  fetchCourses() {
    this.mockService.getCoursesByUserId(this.userId).subscribe({
      next: (courses: Course[]) => {
        this.courses = courses;
      },
      error: (err: any) => {
        console.error('Error fetching courses', err);
      }
    });
  }
  
  // Validation Methods
  validateImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.imageError = 'Please upload an image.';
    } else {
      this.imageError = null;
    }
  }
 
  showWarning(control: any, errorMessage: string) {
    if (control.invalid && control.touched) {
      if (control.name === 'title') {
        this.titleError = errorMessage;
      }
      if (control.name === 'description') {
        this.descriptionError = errorMessage;
      }
      if (control.name === 'relatedCourseId') {
        this.relatedCourseIdError = errorMessage;
      }
      if (control.name === 'fee') {
        this.feeError = errorMessage;
      }
      if (control.name === 'freeAttempts') {
        this.freeAttemptsError = errorMessage;
      }
      if (control.name === 'testType') {
        this.testTypeError = errorMessage;
      }
    }
  }
 
  validateFee() {
    if (this.fee < 0) {
      this.feeError = 'Fee must be greater than or equal to 0.';
    } else {
      this.feeError = null;
    }
  }
  saveMockTestDetails(form: NgForm) {
    if (!form.valid) {
      // Mark all controls as touched to trigger validation messages
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
 
      // Manually trigger the error message for each required field
      if (!form.value.image) {
        this.imageError = 'Please upload an image.';
      }
      if (!form.value.title) {
        this.titleError = 'Title is required and cannot exceed 255 characters.';
      }
      if (!form.value.description) {
        this.descriptionError = 'Description cannot exceed 1000 characters.';
      }
      if (!form.value.relatedCourseId) {
        this.relatedCourseIdError = 'Please select a course.';
      }
      if (!form.value.fee) {
        this.feeError = 'Fee is required and must be greater than or equal to 0.';
      }
      if (!form.value.testType) {
        this.testTypeError = 'Please select a test type.';
      }
 
      console.warn('Test form is invalid');
      return;
    }
 
    const formData = new FormData();
    const teacherId = localStorage.getItem('id');
 
    formData.append('title', form.value.title);
    formData.append('description', form.value.description);
    formData.append('relatedCourseId', form.value.relatedCourseId);
    formData.append('fee', form.value.fee);
    formData.append('freeAttempts', form.value.freeAttempts);
    formData.append('testType', form.value.testType);
 
    if (teacherId) {
      formData.append('teacherId', teacherId);
    } else {
      console.error('Teacher ID not found in local storage');
      return;
    }
 
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      formData.append('image', fileInput.files[0]);
    }
 
    this.mockService.createMockTestInterview(formData).subscribe({
      next: response => {
        this.mockTestDetails = response;
        console.log('Mock test saved successfully');
      },
      error: err => {
        console.error('Error saving mock test details', err);
      }
    });
  }
 
 
  getUserIdFromLocalStorage(): number {
    // Implement this method to retrieve userId from local storage or other source
    return Number(localStorage.getItem('id'));
  }
 
 
  addTestSlot(slotName: string, date: string, startTime: string, endTime: string) {
    if (!slotName || !date || !startTime || !endTime) {
      alert('Please fill in all slot details.');
      return;
    }
  
    const now = new Date(); // ✅ Declare 'now' correctly
    const selectedDate = new Date(date);
    const slotStart = new Date(`${date}T${startTime}`);
    const slotEnd = new Date(`${date}T${endTime}`);
  
    // ❌ Prevent past dates
    if (selectedDate < new Date(now.toDateString())) {
      alert('Slot date cannot be in the past.');
      return;
    }
  
    // ❌ Ensure slot start time is not in the past if today is selected
    if (selectedDate.toDateString() === now.toDateString() && slotStart < now) {
      alert('Slot start time cannot be in the past.');
      return;
    }
  
    // ❌ Ensure end time is after start time
    if (slotEnd <= slotStart) {
      alert('End time must be after start time.');
      return;
    }
  
    const slot: Slot = {
      slotName,
      slotTime: slotStart,
      endTime: slotEnd
    };
  
    this.testSlots.push(slot);
    alert('Slot added successfully!');
  }
 
  removeTestSlot(index: number) {
    this.testSlots.splice(index, 1);
  }
 
  saveTestSlots() {
    if (this.mockTestDetails) {
      this.testSlots.forEach(slot => {
        const slotPayload = {
          slotName: slot.slotName,
          slotTime: slot.slotTime.toISOString(),
          endTime: slot.endTime.toISOString(),
          booked: false,
          mockTestInterview: this.mockTestDetails
        };
 
        this.mockService.saveSlot(slotPayload).subscribe({
          next: (response: any) => {
            console.log('Test slot saved successfully', response);
          },
          error: (err) => {
            console.error('Error saving test slot', err);
          }
        });
      });
    } else {
      console.error('No test details available');
    }
  }
 
  addInterviewSlot(slotName: string, date: string, startTime: string, endTime: string) {
    if (slotName && date && startTime && endTime) {
      const slot: Slot = {
        slotName,
        slotTime: new Date(`${date}T${startTime}`),
        endTime: new Date(`${date}T${endTime}`)
      };
      this.interviewSlots.push(slot);
    } else {
      alert('Please fill in all slot details.');
    }
  }
 
  removeInterviewSlot(index: number) {
    this.interviewSlots.splice(index, 1);
  }
 
  saveInterviewSlots() {
    if (this.mockInterviewDetails) {
      this.interviewSlots.forEach(slot => {
        const slotPayload = {
          slotName: slot.slotName,
          slotTime: slot.slotTime.toISOString(),
          endTime: slot.endTime.toISOString(),
          booked: false,
          mockTestInterview: this.mockInterviewDetails
        };
 
        this.mockService.saveSlot(slotPayload).subscribe({
          next: (response: any) => {
            console.log('Interview slot saved successfully', response);
          },
          error: (err) => {
            console.error('Error saving interview slot', err);
          }
        });
      });
    } else {
      console.error('No interview details available');
    }
  }
 
  saveMockInterviewDetails(form: NgForm) {
    if (form.valid) {
      const formData = new FormData();
      formData.append('title', form.value.title);
      formData.append('description', form.value.description);
      formData.append('relatedCourseId', form.value.relatedCourseId);
      formData.append('fee', form.value.fee);
      formData.append('freeAttempts', form.value.freeAttempts);
      formData.append('testType', form.value.testType);
 
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append('image', fileInput.files[0]);
      }
 
      this.mockService.createMockTestInterview(formData).subscribe({
        next: (response: any) => {
          this.mockInterviewDetails = response;
          this.selectedTestType = form.value.testType; // Set test type
        },
        error: (err: any) => {
          console.error('Error saving mock interview details', err);
        }
      });
    } else {
      console.warn('Interview form is invalid');
    }
  }
 
  // Unified methods
  removeSlot(index: number, type: 'test' | 'interview') {
    if (type === 'test') {
      this.removeTestSlot(index);
    } else if (type === 'interview') {
      this.removeInterviewSlot(index);
    }
  }
 
  saveSlots(type: 'test' | 'interview') {
    if (type === 'test') {
      this.saveTestSlots();
    } else if (type === 'interview') {
      this.saveInterviewSlots();
    }
  }
 
  showOptions() {
    this.formType = 'options';
  }
 
  showTestForm() {
    this.formType = 'test';
  }
 
  showInterviewForm() {
    this.formType = 'interview';
  }
 
  resetForm() {
    this.formType = 'options';
    this.mockTestDetails = null;
    this.mockInterviewDetails = null;
    this.selectedTestType = null;
    this.testSlots = [];
    this.interviewSlots = [];
  }
 
  goBack() {
    if (this.formType === 'test' || this.formType === 'interview') {
      this.resetForm();
    }
  }
 
 
onImageChange(event: any, formType: 'test' | 'interview') {
  this.imageError = null; // Reset the error message
 
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
 
    if (!validImageTypes.includes(file.type)) {
      this.imageError = 'Please upload a valid image file (JPEG, PNG, GIF, or WEBP).';
      event.target.value = ''; // Reset the input field
      return;
    }
 
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (formType === 'test') {
        this.testImage = e.target.result;
      } else if (formType === 'interview') {
        this.interviewImage = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}
 
fee: any; // To bind the fee input value
errors: { [key: string]: string | null } = {};
 
// showWarning(control: any, message: string): void {
//   if (control.invalid && control.touched) {
//     this.errors[`${control.name}Error`] = message;
//   } else {
//     this.errors[`${control.name}Error`] = null;
//   }
// }
// validateImage(): void {
//   if (!this.imageError) {
//     this.imageError = 'Please upload a valid image.';
//   }
// }
  formatTime(date: Date): string {
    return date.toTimeString().split(' ')[0].substring(0, 5);
  }
 
  formatDateTime(date: Date): string {
    return date.toLocaleString();
  }
 
  submitQuizForm() {
    if (this.selectedTestType === 'QUIZ') {
      console.log('Submitting Quiz Form');
      // Add logic for submitting the quiz form
    }
  }
 
  submitAssessmentForm() {
    if (this.selectedTestType === 'ASSIGNMENT') {
      console.log('Submitting Assessment Form');
      // Add logic for submitting the assessment form
    }
  }
  submitProjectForm(projectForm: NgForm): void {
    if (projectForm.valid) {
      const teacherId = localStorage.getItem('id');
      const mockId = this.mockTestDetails?.id;
 
      if (teacherId && mockId) {
        const fileInput = document.querySelector('input[name="projectDocument"]') as HTMLInputElement;
        const projectDocument = fileInput?.files?.[0];
 
        if (projectDocument) {
          this.mockService.createProjectByMock(
            projectForm.value.projectTitle,
            projectForm.value.projectDescription,
            projectDocument,
            mockId,
            parseInt(teacherId)
          ).subscribe({
            next: (response: string) => {
              console.log('Project created successfully:', response);
            },
            error: (err: any) => {
              console.error('Error creating project', err);
            }
          });
        } else {
          console.error('Project document is missing');
        }
      } else {
        console.error('Teacher ID or Mock ID is missing');
      }
    } else {
      console.warn('Project form is invalid');
    }
  }
 
 
 
 
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.assignmentForm.patchValue({
        document: file
      });
    }
  }
 onStudentSelectionChange(event: any, student: any): void {
    if (event.target.checked) {
      this.selectedStudents.push(student);
    } else {
      this.selectedStudents = this.selectedStudents.filter(s => s !== student);
    }
  }
  closeOverlay(): void {
    // Logic to close the overlay
  }
 /////////// interview ///////////
 
 resetMockTest() {
  this.mockTestCreated = false;
  this.mockTestDetails = null;
  this.selectedTestType = null;
  // Reset any other relevant properties
}
 interviewForm: FormGroup;
 initializeForm() {
  this.interviewForm = new FormBuilder().group({
    interviewName: ['', Validators.required],
    interviewTime: ['', [Validators.required, this.futureDateValidator]]
  });
}
 
// ✅ Prevents selecting past dates
futureDateValidator(control: any) {
  if (!control.value) return null;
  return new Date(control.value) < new Date() ? { pastDate: true } : null;
}
 
submitInterviewForm() {
  if (this.interviewForm.invalid) {
    this.interviewForm.markAllAsTouched();
    console.warn('Form is invalid');
    return;
  }
 
  const { interviewName, interviewTime } = this.interviewForm.value;
  const teacherId = Number(localStorage.getItem('id'));
  const mockId = this.mockTestDetails?.id;
 
  if (!teacherId || !mockId) {
    console.error('Teacher ID or Mock ID is missing');
    return;
  }
 
  this.mockService.createRoomForMock(interviewName, teacherId, mockId, interviewTime).subscribe({
    next: () => alert('Training room created successfully'),
    error: (err: any) => alert('Error creating training room!')
  });
}

submitAssignmentForm() {
  console.log("API HIT");
}

//assignment
assignmentSubmissionMessage: string ='';
assignmentForm: FormGroup;
selectedFile: File | null = null;
submitAssignmentForm1122() {
    if (this.assignmentForm.valid && this.mockTestDetails) {
      const formData = new FormData();
      formData.append('assignmentTitle', this.assignmentForm.get('title')?.value);
      formData.append('assignmentTopicName', this.assignmentForm.get('topicName')?.value);
      formData.append('assignmentDescription', this.assignmentForm.get('description')?.value);
      formData.append('file', this.assignmentForm.get('document')?.value);
      formData.append('mockId', this.mockTestDetails.id.toString());
     
      const teacherId = localStorage.getItem('id');
      if (!teacherId) {
        console.error('Teacher ID not found in local storage');
        this.assignmentSubmissionMessage = 'Error: Teacher ID not found.';
        return;
      }
      formData.append('teacherId', teacherId);
 
      this.mockService.createAssignmentByMock(formData).subscribe({
        next: (response) => {
          console.log('Success:', response);
          this.assignmentSubmissionMessage = 'Assignment submitted successfully!';
          this.assignmentForm.reset();
        },
        error: (error) => {
          console.error('Error:', error);
          this.assignmentSubmissionMessage = 'Error submitting assignment. Please try again.';
        }
      });
    } else {
      this.assignmentSubmissionMessage = 'Please fill all required fields.';
    }
  }
  /////////////////////////////////////table//////////////////////////
  submissions: any[] = [];
  getSubmissions(): void {
    const teacherId = localStorage.getItem('id');
    if (teacherId) {
      this.mockService.getSubmissionsByTeacher(teacherId).subscribe(
        {next:(response: any) => {
          const assignments: Assignment[] = response.submittedAssignments || [];
          const projects: Project[] = response.submittedProjects || [];
 
          // Combine both arrays with a type identifier
          this.submissions = [
            ...assignments.map((a: Assignment) => ({ ...a, type: 'assignment' })),
            ...projects.map((p: Project) => ({ ...p, type: 'project' }))
          ];
 
          // Format submittedAt to a readable date string
          this.submissions.forEach(submission => {
            submission.formattedDate = this.formatDate(submission.submittedAt);
          });
 
          console.log('Submissions fetched successfully:', this.submissions);
        },
        error:(error) => {
          console.error('Error fetching submissions:', error);
        }}
      );
    } else {
      console.warn('No teacher ID found in local storage');
    }
  }
  // Helper method to format the date array into a readable string
  formatDate(dateArray: number[]): string {
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
  }
  // Method to navigate based on the submission type and ID
  viewDetails(assignmentId: string | null, projectId: string | null, userId: string): void {
    if (assignmentId) {
        this.router.navigate(['/mock-feedback', assignmentId, userId, 'assignment']);
    } else if (projectId) {
        this.router.navigate(['/mock-feedback', projectId, userId, 'project']);
    } else {
        console.warn('No valid ID found for navigation.');
    }
}
}
 
 
 