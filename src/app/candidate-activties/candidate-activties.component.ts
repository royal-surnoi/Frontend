 
import { catchError, Observable, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AssignmentnewComponent } from '../assignmentnew/assignmentnew.component';
import { QuiznewComponent } from '../quiznew/quiznew.component';
import { ProjectnewComponent } from '../projectnew/projectnew.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Answer, StudentdashboardService } from '../studentdashboard.service';
import { CandidateActivitiesService } from '../candidate-activities.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
interface Activity {
  id: number;
  type: 'quiz' | 'assignment' | 'project';
  name: string;
  description: string;
  dueDate: Date;
  content: any;
}
interface Assignment {
  id: number;
  assignmentTitle: string;
  assignmentDescription: string;
  assignmentDocument: string;
  assignmentAnswer: string | null;
  assignmentTopicName: string;
  startDateFormatted?: Date;
  endDateFormatted?: Date;
  reviewMeetDateFormatted?: Date;
  maxScore: number;
  createdAt: string;
  updatedAt: string;
  teacher: {
    id: number;
    name: string;
    email: string;
  };
  lesson: {
    id: number;
  } | null;
  startDate: number[];
  endDate: number[];
  reviewMeetDate: number[],
  formattedStartDate:any
  formattedEndDate:any
  formattedReviewDate:any
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}
interface Quiz {
  id: number;
  title: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}
 
interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
}
 
interface Project {
  id: number;
  name: string;
  description: string;
  dueDateTime: string;
  maxTeamSize: number;
  githubUrl: string;
  teamMembers: string[];
}
interface Question {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}
 
@Component({
  selector: 'app-candidate-activties',
  standalone: true,
  imports: [CommonModule, AssignmentnewComponent, QuiznewComponent, ProjectnewComponent, ReactiveFormsModule, FormsModule,RouterLink,
    ToastModule, ButtonModule, RippleModule
  ],
  providers: [MessageService],
  templateUrl: './candidate-activties.component.html',
  styleUrl: './candidate-activties.component.css', animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class CandidateActivtiesComponent implements OnInit {
  submissionStatus: string = '';
  submittedAssignment: any | null = null;
  submittedAnswer: string | null = null;
  submittedFileName: string | null = null;
  assignmentForm!: FormGroup;
  assignment: Assignment | null = null;
  courseId: any;
  courseType: any;
  userId: any;
  lessonId: any;
  selectedProject: any = null;
  selectedFile: File | null = null;
  submittedAnswers: Answer[] = [];
  quizSuccess: any;
  quizzes: Quiz[] = [];
  quizId: any;
  questions: Question[] = [];
  projectNotes: string = '';
  projectDetails: any;
  userID: any;
  activityType: any;
  submissionSuccess: boolean = false;  // Flag to check if the project is submitted successfully
  submittedProject: any = {};
  activityId: any;
  ngOnInit(): void {
    this.userId = localStorage.getItem('id')
    this.quizForm = this.fb.group({
      answers: this.fb.array([])
    });
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('courseId');
      this.courseType = params.get('courseType'); // Added this line
      this.activityType = params.get('activityType');
      this.activityId = params.get('activityId');
    });
    console.log(this.activeTab === 'assignment' && '!submissionStatus',"checking the weather the is working or not")
    console.log(this.activityId,this.courseType,this.courseId,"activityID----------")
    this.quizId = this.activityId
    console.log('Route params:', { courseId: this.courseId, activityType: this.activityType, quizId: this.quizId, userId: this.userId });
    this.quizForm = this.fb.group({
      answers: this.fb.array(this.questions.map(() => ['', Validators.required]))
    });
    if (this.activityType === 'project') {
      this.getProjectBycourseId(this.courseId);
    }
    if (this.activityType === 'assessment') {
      this.getAssignmentDetails(this.activityId)
    }
    if (this.activityType === 'quiz') {
      this.loadQuestions(this.quizId)
    }
   
   
    this.assignmentForm = this.fb.group({
      answer: ['', Validators.required]
    });
  }
  activeTab = 'quiz';
  activeModule = '';
  // userId: any;
  modules = ['Module 1', 'Module 2', 'Module 3'];
 
  constructor(private http: HttpClient, private messageService: MessageService,private fb: FormBuilder, private studentdashboardService: StudentdashboardService, private route: ActivatedRoute, private candidateActivitiesService: CandidateActivitiesService,private router: Router) {
    this.quizForm = this.fb.group({
      answers: this.fb.array([])
    });
    this.userID = localStorage.getItem('id')
    this.initForm();
  }
  quizForm: FormGroup;
  
  projects: Project[] = [
    {
      id: 1,
      name: 'E-commerce Website',
      description: 'Build a fully functional e-commerce website using Angular and Node.js',
      dueDateTime: '2024-09-30T18:00',
      maxTeamSize: 3,
      githubUrl: '',
      teamMembers: ['']
    }
  ];
  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.activeModule = this.modules[0];
  }
  setActiveModule(module: string) {
    this.activeModule = module;
  }
  submitQuiz() {
    alert('Quiz submitted successfully!');
  }
  addTeamMember(project: Project) {
    if (project.teamMembers.length < project.maxTeamSize) {
      project.teamMembers.push('');
    }
  }
  removeTeamMember(project: Project, index: number) {
    project.teamMembers.splice(index, 1);
  }
 
  // Add a variable to store the uploaded file
  file!: File;
 
  // Add a function to handle file upload
  uploadFile(event: any) {
    this.file = event.target.files[0];
  }
  showToast1() {
    console.log("11111111111")
    this.messageService.clear();
    this.messageService.add({ key: 'toast1', severity: 'success', summary: 'Success', detail: 'key: toast1' });
}
private initForm(): void {
  this.assignmentForm = this.fb.group({
    answer: ['', Validators.required]
  });
}
 
private initializeRouteParams(): void {
  this.route.paramMap.subscribe(params => {
    this.courseId = params.get('courseId');
    this.courseType = params.get('courseType') || '';
  });
}

 
back(courseId: string): void {
  this.router.navigate(['/activities', courseId]);
}

 
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    this.submittedFileName = input.files[0].name;
  }
}
 
submitAssignment(assignmentId: number, studentId: string, courseType: string): void {
  if (!this.assignmentForm.valid || !this.selectedFile) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please fill in all required fields'
    });
    return;
  }
 
  const formData = new FormData();
  const answerKey = courseType === 'individual' ? 'assignmentAnswer' : 'userAssignmentAnswer';
  formData.append(answerKey, this.assignmentForm.get('answer')?.value);
  formData.append('file', this.selectedFile);
  formData.append('studentId', studentId);
  formData.append('courseId', this.courseId);
  formData.append('assignmentId', assignmentId.toString());
 
  const submissionUrl = this.getSubmissionUrl(courseType, studentId, assignmentId);
 
  this.http.post(submissionUrl, formData, { responseType: 'text' })
    .pipe(catchError(this.handleError))
    .subscribe({
      next: (response) => {
        this.handleSubmissionSuccess(response);
      },
      error: (error) => {
        this.handleSubmissionError(error);
      }
    });
}
 
private getSubmissionUrl(courseType: string, studentId: string, assignmentId: number): string {
  if (courseType === 'individual') {
    return `${environment.apiBaseUrl}/submitNewByStudentId?studentId=${studentId}&courseId=${this.courseId}&assignmentId=${assignmentId}`;
  } else {
    this.lessonId = localStorage.getItem('lessonId');
    return `${environment.apiBaseUrl}/submitAssignmentByUserAndLesson/${studentId}/${assignmentId}/${this.lessonId}`;
  }
}
 
private handleSubmissionSuccess(response: any): void {
  this.submissionStatus = 'Assignment submitted successfully';
  this.submittedAssignment = this.assignment;
  this.submittedAnswer = this.assignmentForm.get('answer')?.value;
 
  this.messageService.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Assignment submitted successfully'
  });
}
 
private handleSubmissionError(error: any): void {
  if (error.status === 409) {
    this.submissionStatus = 'Assignment already submitted';
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Assignment has already been submitted'
    });
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to submit assignment'
    });
  }
}
 
private handleError(error: any): Observable<never> {
  console.error('An error occurred:', error);
  return throwError(() => new Error('Something went wrong; please try again later.'));
}
showToast2() {
    this.messageService.clear();
    this.messageService.add({ key: 'toast2', severity: 'warn', summary: 'Warning', detail: 'key: toast2' });
}
 
 
  initializeFormControls() {
    const answersArray = this.quizForm.get('answers') as FormArray;
    this.questions.forEach(() => {
      answersArray.push(this.fb.control('', Validators.required));
    });
    console.log('Form controls initialized:', answersArray);
  }
 
  logSelection(index: number, option: string) {
    console.log(`Question ${index + 1} selected: ${option}`);
    console.log('Current form value:', this.quizForm.value);
  }
 
 
  logFormErrors() {
    console.log('Logging form errors:');
    Object.keys(this.quizForm.controls).forEach(key => {
      const abstractControl = this.quizForm.get(key);
      if (abstractControl instanceof FormArray) {
        this.logFormArrayErrors(abstractControl);
      } else if (abstractControl instanceof FormGroup) {
        this.logFormGroupErrors(abstractControl);
      } else {
        this.logControlErrors(key, abstractControl);
      }
    });
  }
 
  logFormArrayErrors(formArray: FormArray) {
    formArray.controls.forEach((control, index) => {
      if (control instanceof FormGroup) {
        this.logFormGroupErrors(control);
      } else {
        this.logControlErrors(`${index}`, control);
      }
    });
  }
 
  logFormGroupErrors(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      this.logControlErrors(key, control);
    });
  }
 
  logControlErrors(key: string, control: AbstractControl | null) {
    const controlErrors = control?.errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach(keyError => {
        console.log(`Key control: ${key}, keyError: ${keyError}, err value: `, controlErrors[keyError]);
      });
    }
  }
 
  checkControlValidity() {
    const answersArray = this.quizForm.get('answers') as FormArray;
    answersArray.controls.forEach((control, index) => {
      console.log(`Question ${index + 1} - Valid: ${control.valid}, Value: ${control.value}`);
    });
  }
 
 
  allQuestionsAnswered(): boolean {
    const answersArray = this.quizForm.get('answers') as FormArray;
    return answersArray.controls.every(control => control.value !== '');
  }
  getAssignmentDetails(assignmentId: string): void {
    this.http.get<Assignment>(`${environment.apiBaseUrl}/getAssignment/${assignmentId}`)
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (response) => {
          // Format the dates before assigning to this.assignment
          this.assignment = {
            ...response,
            formattedStartDate: this.formatArrayToDate(response.startDate),
            formattedEndDate: this.formatArrayToDate(response.endDate),
            formattedReviewDate: this.formatArrayToDate(response.reviewMeetDate)
          };
         
          this.messageService.add({
            severity: 'info',
            summary: 'Ready',
            detail: 'Assighnment  loaded successfully'
          });
        },
        error: (error) => {
          console.error('Error loading assignment:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load assignment details'
          });
        }
      });
  }
 
  resetForm() {
    this.quizForm.reset();
    const answersArray = this.quizForm.get('answers') as FormArray;
    answersArray.clear();
    this.initializeFormControls();
    console.log('Form reset.');
  }
  navigateToActivites(){
    this.router.navigate(['/activities']);
  }

 
  submitProject(userId: number, courseId: number, projectId: number, courseType: any) {
    if (!this.selectedFile || !this.projectNotes) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please provide both project notes and a file'
      });
      return;
    }
 
    const formData = new FormData();
    formData.append('userAnswer', this.projectNotes);
    formData.append('file', this.selectedFile);
 
    this.candidateActivitiesService.submitProject(userId, courseId, projectId, formData, courseType).subscribe({
      next: (response) => {
        console.log('Project submitted successfully:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Project submitted successfully!'
        });
       
        this.submissionSuccess = true;
        this.submittedProject = {
          title: this.selectedProject?.projectTitle,
          description: this.selectedProject?.projectDescription,
          notes: this.projectNotes,
          file: this.selectedFile?.name
        };
        this.activityType = 'submissionSuccess';
      },
      error: (error) => {
        console.error('Error submitting project:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to submit project'
        });
      }
    });
  }
  formatArrayToDate(dateArray: number[]): Date | null {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
      return null;
    }
   
    // Extract components from array
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
   
    // Create date - subtract 1 from month as JavaScript months are 0-based
    return new Date(year, month - 1, day, hour, minute, second);
  }
 
  getProjectBycourseId(courseId: any): void {
    this.http.get<any>(`${environment.apiBaseUrl}/project/course/${courseId}`).pipe(
      catchError(this.handleError)
    ).subscribe({
      next: (res) => {
        console.log('Project details fetched:', res);
        this.projectDetails = res;
       
        if (this.activityId) {
          this.selectedProject = this.projectDetails.find(
            (project:any) => project.id === parseInt(this.activityId)
          );
         
          if (this.selectedProject) {
            // Format all dates
            const deadline = this.formatArrayToDate(this.selectedProject.projectDeadline);
            const start = this.formatArrayToDate(this.selectedProject.startDate);
            const review = this.formatArrayToDate(this.selectedProject.reviewMeetDate);
 
            // Add formatted dates to the project object
            this.selectedProject = {
              ...this.selectedProject,
              formattedDeadline: deadline,
              formattedStartDate: start,
              formattedReviewDate: review
            };
            this.messageService.add({
              severity: 'info',
              summary: 'Ready',
              detail: 'project loaded successfully'
            });
          } else {
            console.error('Project not found with ID:', this.activityId);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Project not found'
            });
          }
        }
      },
      error: (error) => {
        console.error('Error fetching project details:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch project details'
        });
      }
    });
  }

 
  onSubmit(courseType: any) {
    if (!this.quizForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please answer all questions before submitting'
      });
      this.logFormErrors();
      return;
    }
 
    const answersArray = this.quizForm.get('answers') as FormArray;
    const answers: Answer[] = answersArray.controls.map((control, index) => ({
      question: { id: this.questions[index].id },
      selectedAnswer: control.value,
      quiz: { id: this.quizId },
      user: { id: this.userId }
    }));
 
    console.log('Submitting answers:', answers);
 
    this.studentdashboardService.submitAnswers(this.quizId, this.userId, answers, courseType).subscribe({
      next: (response) => {
        console.log('Server response:', response);
        this.submittedAnswers = answers;
        this.activityType = 'quizSuccess';
       
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Quiz submitted successfully!'
        });
 
        // Update progress
        this.http.post(`${environment.apiBaseUrl}/api/quizzes/progress/${this.quizId}?userId=${this.userId}`, "")
          .subscribe({
            next: (res) => {
              console.log('Progress updated:', res);
            },
            error: (err) => {
              console.error('Error updating progress:', err);
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Quiz submitted but progress update failed'
              });
            }
          });
      },
      error: (error) => {
        console.error('Error submitting answers:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to submit quiz answers'
        });
      }
    });
  }
 
  loadQuestions(quizId: any): void {
    this.studentdashboardService.getQuestionsForQuiz(quizId).subscribe({
      next: (data: any[]) => {
        this.questions = data;
        this.initializeFormControls();
        console.log('Questions loaded:', this.questions);
        this.messageService.add({
          severity: 'info',
          summary: 'Ready',
          detail: 'Quiz questions loaded successfully'
        });
      },
      error: (error) => {
        console.error('Error fetching questions:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load quiz questions'
        });
      }
    });
  }
  formatDate(dateArray: number[] | string | Date): Date {
    if (Array.isArray(dateArray)) {
      // Handle number array format [year, month, day, hour, minute]
      // Note: JavaScript months are 0-based, so we subtract 1 from the month
      return new Date(dateArray[0], dateArray[1] - 1, dateArray[2],
                     dateArray[3] || 0, dateArray[4] || 0);
    } else if (dateArray instanceof Date) {
      return dateArray;
    } else if (typeof dateArray === 'string') {
      return new Date(dateArray);
    }
    return new Date(); // fallback for invalid input
  }

}
 
 