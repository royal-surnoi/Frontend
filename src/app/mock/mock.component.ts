import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MockService } from '../mock.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainingRoom } from '../mentoronline.service';
import { Router } from '@angular/router';
import { MockTestService } from '../mocktest.service';

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
  submittedAt: number[];
}

interface Project {
  project_id: string;
  title: string;
  submittedAt: number[];
}

@Component({
  selector: 'app-mock',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mock.component.html',
  styleUrls: ['./mock.component.css']
})
export class MockComponent implements OnInit {
  mockTestCreated = false;
  formType: string | null = null;
  selectedTestType: string | null = null;
  testSlots: Slot[] = [];
  interviewSlots: Slot[] = [];
  testImage: string | ArrayBuffer | null = 'assets/default-image.png';
  interviewImage: string | ArrayBuffer | null = 'assets/default-image.png';
  courses: Course[] = [];
  mockTestDetails: any = null;
  mockInterviewDetails: any = null;
  interviewDetails: any = null;
  interviews: any[] = [];
  errorMessage: string = '';
  teacherId: any;
  projectForm: FormGroup = new FormGroup({});
  enrolledStudents: any[] = [];
  selectedStudents: any[] = [];
  userId: any;
  mocks: any[] = [];
  interviewDetailsList: any[] = [];
  assignmentSubmissionMessage: string = '';
  assignmentForm: FormGroup;
  interviewForm: FormGroup;
  selectedFile: File | null = null;
  fileError: string | null = null;
  isSubmitting: boolean = false;
  showSuccessPopup: boolean = false;
  slotName: string = '';
  slotDate: string = '';
  slotStartTime: string = '';
  slotEndTime: string = '';
  dateError: boolean = false;
  timeError: boolean = false;
  endTimeError: boolean = false;
  showErrors: boolean = false;
  submissions: any[] = [];
  mockDetails: any[] = [];

  constructor(
    private mockService: MockService,
    private fb: FormBuilder,
    private router: Router,
    private mockTestService: MockTestService
  ) {
    this.interviewForm = this.fb.group({
      interviewName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      interviewTime: ['']
    });

    this.assignmentForm = this.fb.group({
      assignmentTitle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      assignmentTopicName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      assignmentDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1500)]]
    });
  }

  ngOnInit(): void {
    this.teacherId = localStorage.getItem('id');
    this.getSubmissions();
    this.userId = this.getUserIdFromLocalStorage();
    this.fetchCourses();
    this.getMockDetails();

    this.projectForm = this.fb.group({
      projectTitle: ['', Validators.required],
    });

    const storedTeacherId = localStorage.getItem('id');
    if (storedTeacherId) {
      this.teacherId = +storedTeacherId;
      this.getMocks();
    }
  }

  getMocks(): void {
    if (this.teacherId) {
      this.mockTestService.getMocksByTeacherId(this.teacherId).subscribe(
        (data) => {
          this.mocks = data;
          console.log('Fetched Mocks:', this.mocks);

          if (this.mocks.length > 0) {
            this.fetchInterviewDetailsForAllMocks(this.mocks.map(mock => mock.mockId));
          }
        },
        (error) => {
          console.error('Error fetching mocks:', error);
        }
      );
    }
  }

  fetchInterviewDetailsForAllMocks(mockIds: number[]): void {
    mockIds.forEach((mockId) => {
      this.getInterviewDetails(mockId);
    });
  }

  getInterviewDetails(mockId: number): void {
    this.mockTestService.getMockTestById(mockId).subscribe({
      next: (response) => {
        console.log('API Response for Mock ID', mockId, ':', response);

        if (response && response.testType === 'INTERVIEW') {
          this.interviewDetailsList.push({
            mockId: mockId,
            ...response.interviews[0],
          });
        }
      },
      error: (error) => console.error('Error fetching mock test details for Mock ID:', mockId, error)
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

  getUserIdFromLocalStorage(): number {
    return Number(localStorage.getItem('id'));
  }

  addTestSlot(slotName: string, date: string, startTime: string, endTime: string) {
    if (slotName && date && startTime && endTime) {
      const currentDateTime = new Date();
      const slotStartTime = new Date(`${date}T${startTime}`);
      const slotEndTime = new Date(`${date}T${endTime}`);

      if (slotName.length < 3 || slotName.length > 30) {
        alert('Slot name must be between 3 and 30 characters long.');
        return;
      }

      if (slotStartTime < currentDateTime) {
        alert('Test slot start time cannot be earlier than the current date and time.');
        return;
      }

      if (slotEndTime <= slotStartTime) {
        alert('Test slot end time must be later than the start time.');
        return;
      }

      const slot: Slot = {
        slotName,
        slotTime: slotStartTime,
        endTime: slotEndTime
      };

      this.testSlots.push(slot);
    } else {
      alert('Please fill in all slot details.');
    }
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

  saveMockTestDetails(form: NgForm) {
    if (form.valid) {
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
        next: (response: any) => {
          this.mockTestDetails = response;
          this.selectedTestType = form.value.testType;
          if (this.selectedTestType === 'INTERVIEW') {
            this.interviewForm.patchValue({
              interviewName: response.title,
              interviewTime: ''
            });
          }
        },
        error: (err: any) => {
          console.error('Error saving mock test details', err);
        }
      });
    } else {
      console.warn('Test form is invalid');
    }
  }

  addInterviewSlot(slotName: string, date: string, startTime: string, endTime: string) {
    if (slotName && date && startTime && endTime) {
      const currentDateTime = new Date();
      const slotStartTime = new Date(`${date}T${startTime}`);
      const slotEndTime = new Date(`${date}T${endTime}`);

      if (slotName.length < 3 || slotName.length > 30) {
        alert('Slot name must be between 3 and 30 characters long.');
        return;
      }

      if (slotStartTime < currentDateTime) {
        alert('Slot start time cannot be earlier than the current date and time.');
        return;
      }

      if (slotEndTime <= slotStartTime) {
        alert('Slot end time must be later than the start time.');
        return;
      }

      const slot: Slot = {
        slotName,
        slotTime: slotStartTime,
        endTime: slotEndTime
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
          this.selectedTestType = form.value.testType;
        },
        error: (err: any) => {
          console.error('Error saving mock interview details', err);
        }
      });
    } else {
      console.warn('Interview form is invalid');
    }
  }

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
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (formType === 'test') {
          this.testImage = e.target.result;
        } else if (formType === 'interview') {
          this.interviewImage = e.target.result;
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  formatTime(date: Date): string {
    return date.toTimeString().split(' ')[0].substr(0, 5);
  }

  formatDateTime(date: Date): string {
    return date.toLocaleString();
  }

  submitQuizForm() {
    if (this.selectedTestType === 'QUIZ') {
      console.log('Submitting Quiz Form');
    }
  }

  submitAssessmentForm() {
    if (this.selectedTestType === 'ASSIGNMENT') {
      console.log('Submitting Assessment Form');
    }
  }

  validateFile(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const fileSizeLimit = 5 * 1024 * 1024;
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!allowedExtensions.includes(fileExtension!)) {
        this.fileError = 'Only PDF, DOC, and DOCX files are allowed.';
      } else if (file.size > fileSizeLimit) {
        this.fileError = 'File size must be less than 5MB.';
      } else {
        this.fileError = null;
      }
    }
  }

  submitProjectForm(projectForm: NgForm): void {
    if (projectForm.valid && !this.fileError) {
      this.isSubmitting = true;

      const teacherId = localStorage.getItem('id');
      const mockId = this.mockTestDetails?.id;

      if (teacherId && mockId) {
        const fileInput = document.querySelector('input[name="projectDocument"]') as HTMLInputElement;
        const projectDocument = fileInput?.files?.[0];

        if (projectDocument) {
          const formData = new FormData();
          formData.append('projectTitle', projectForm.value['projectTitle']);
          formData.append('projectDescription', projectForm.value['projectDescription']);
          formData.append('projectDocument', projectDocument);
          formData.append('mockId', mockId);
          formData.append('teacherId', teacherId);
          this.mockService.createProjectByMock(
            projectForm.value['projectTitle'],
            projectForm.value['projectDescription'],
            projectDocument,
            mockId,
            parseInt(teacherId)
          ).subscribe({
            next: (response: string) => {
              console.log('Project created successfully:', response);
              this.isSubmitting = false;
              this.showSuccessPopup = true;
              alert('Project submitted successfully! ✅');
              projectForm.resetForm();
            },
            error: (err: any) => {
              console.error('Error creating project', err);
              this.isSubmitting = false;
              alert(err.error);
            }
          });
        } else {
          console.error('Project document is missing');
          this.isSubmitting = false;
          alert('Please upload a project document.');
        }
      } else {
        console.error('Teacher ID or Mock ID is missing');
        this.isSubmitting = false;
        alert('Teacher ID or Mock ID is missing.');
      }
    } else {
      console.warn('Project form is invalid');
      alert('Please fill all required fields correctly before submitting.');
    }
  }

  closePopup(): void {
    this.showSuccessPopup = false;
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      if (allowedTypes.includes(file.type) && file.size <= 3 * 1024 * 1024) {
        this.selectedFile = file;
      } else {
        this.assignmentSubmissionMessage = 'Invalid file type or size. Only PDF/DOCX under 3MB allowed.';
        this.selectedFile = null;
      }
    }
  }

  submitAssignmentForm1122() {
    if (this.assignmentForm.valid && this.mockTestDetails) {
      const formData = new FormData();

      formData.append('assignmentTitle', this.assignmentForm.get('assignmentTitle')?.value);
      formData.append('assignmentTopicName', this.assignmentForm.get('assignmentTopicName')?.value);
      formData.append('assignmentDescription', this.assignmentForm.get('assignmentDescription')?.value);

      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      } else {
        this.assignmentSubmissionMessage = 'Error: Please upload a valid document.';
        alert(this.assignmentSubmissionMessage);
        return;
      }

      const teacherId = localStorage.getItem('id');
      if (!teacherId) {
        console.error('Teacher ID not found in local storage');
        this.assignmentSubmissionMessage = 'Error: Teacher ID not found.';
        alert(this.assignmentSubmissionMessage);
        return;
      }

      formData.append('teacherId', teacherId.toString());
      formData.append('mockId', this.mockTestDetails.id.toString());

      this.mockService.createAssignmentByMock(formData).subscribe({
        next: (response) => {
          console.log('Success:', response);
          this.assignmentSubmissionMessage = 'Assignment submitted successfully!';
          alert(this.assignmentSubmissionMessage);
          this.assignmentForm.reset();
          this.selectedFile = null;
          (document.getElementById('document') as HTMLInputElement).value = '';
        },
        error: (error) => {
          console.error('Error:', error);
          this.assignmentSubmissionMessage = 'Error submitting assignment. Please try again.';
          alert(this.assignmentSubmissionMessage);
        }
      });
    } else {
      this.assignmentSubmissionMessage = 'Please fill all required fields.';
      alert(this.assignmentSubmissionMessage);
    }
  }

  submitInterviewForm() {
    if (this.interviewForm.valid) {
      const name = this.interviewForm.value.interviewName;
      const scheduledTime = this.interviewForm.value.interviewTime;
      const teacherId = Number(localStorage.getItem('id'));
      const mockId = this.mockTestDetails.id;

      if (teacherId && mockId) {
        this.mockService.createRoomForMock(name, teacherId, mockId, scheduledTime).subscribe({
          next: (room: TrainingRoom) => {
            console.log('Training room created successfully:', room);
            alert('Training room created successfully:');
          },
          error: (err: any) => {
            console.error('Error creating training room', err);
            alert('Error creating training room!');
          }
        });
      } else {
        console.error('Teacher ID or Mock ID is missing');
      }
    } else {
      console.warn('Interview form is invalid');
    }
  }

  getSubmissions(): void {
    const teacherId = localStorage.getItem('id');
    if (teacherId) {
      this.mockService.getSubmissionsByTeacher(teacherId).subscribe(
        (response: any) => {
          const assignments: Assignment[] = response.submittedAssignments || [];
          const projects: Project[] = response.submittedProjects || [];

          this.submissions = [
            ...assignments.map((a: Assignment) => ({ ...a, type: 'assignment' })),
            ...projects.map((p: Project) => ({ ...p, type: 'project' }))
          ];

          this.submissions.forEach(submission => {
            submission.formattedDate = this.formatDate(submission.submittedAt);
          });

          console.log('Submissions fetched successfully:', this.submissions);
        },
        (error) => {
          console.error('Error fetching submissions:', error);
        }
      );
    } else {
      console.warn('No teacher ID found in local storage');
    }
  }

  formatDate(dateArray: number[]): string {
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
  }

  viewDetails(assignmentId: string | null, projectId: string | null, userId: string): void {
    if (assignmentId) {
      this.router.navigate(['/mock-feedback', assignmentId, userId, 'assignment']);
    } else if (projectId) {
      this.router.navigate(['/mock-feedback', projectId, userId, 'project']);
    } else {
      console.warn('No valid ID found for navigation.');
    }
  }

  getMockDetails(): void {
    const teacherId = Number(localStorage.getItem('id'));
    this.mockTestService.getMockDetails(teacherId).subscribe(
      (data) => {
        this.mockDetails = data;
        console.log(this.mockDetails);
      },
      (error) => {
        console.error('Error fetching mock details:', error);
      }
    );
  }

  editMockDetails(mockId: number): void {
    this.router.navigate(['/edit-mock', mockId]);
  }

  deleteMock(mockId: number): void {
    if (confirm('Are you sure you want to delete this mock test?')) {
      this.mockTestService.deleteMock(mockId).subscribe({
        next: () => {
          this.mocks = this.mocks.filter(mock => mock.mockId !== mockId);
          console.log('Mock test deleted successfully');
        },
        error: (error: any) => {
          console.error('Error deleting mock test:', error);
        }
      });
    }
  }

  validateDate() {
    const today = new Date().toISOString().split('T')[0];
    this.dateError = this.slotDate < today;
  }

  validateStartTime() {
    const now = new Date();
    const selectedDate = new Date(this.slotDate);
    const selectedTime = new Date(`${this.slotDate}T${this.slotStartTime}`);

    this.timeError = selectedDate.toDateString() === now.toDateString() && selectedTime < now;
  }

  validateEndTime() {
    this.endTimeError = this.slotEndTime <= this.slotStartTime;
  }

  isFormValid(): boolean {
    return (
      this.slotName.trim().length >= 3 &&
      this.slotName.trim().length <= 30 &&
      !!this.slotDate &&
      !!this.slotStartTime &&
      !!this.slotEndTime &&
      !this.dateError &&
      !this.timeError &&
      !this.endTimeError
    );
  }

  addTestSlots() {
    this.showErrors = true;
    if (!this.isFormValid()) {
      alert('Please fill all required fields correctly.');
      return;
    }

    console.log('Slot added:', {
      slotName: this.slotName,
      slotDate: this.slotDate,
      slotStartTime: this.slotStartTime,
      slotEndTime: this.slotEndTime
    });

    alert('Slot added successfully!');

    this.slotName = '';
    this.slotDate = '';
    this.slotStartTime = '';
    this.slotEndTime = '';
    this.dateError = false;
    this.timeError = false;
    this.endTimeError = false;
    this.showErrors = false;
  }

  formatPostedDate(createdAt: number[]): string {
    if (!createdAt || createdAt.length < 3) return 'Date unknown';

    const jobDate = new Date(createdAt[0], createdAt[1] - 1, createdAt[2]);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const diffTime = now.getTime() - jobDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  removeMock(mockId: number, teacherId: number): void {
    const confirmation = confirm('Are you sure you want to delete this mock?');
    if (confirmation) {
      this.mockTestService.removeMock(mockId, teacherId).subscribe(
        (response) => {
          console.log(response);
          alert(response);
        },
        (error) => {
          console.error('Error removing mock:', error);
        }
      );
    } else {
      console.log('Mock deletion cancelled');
    }
  }
}
