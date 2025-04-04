import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Assignment, CourseDocuments, CourseVideoTrailer, FusionService, Lesson1, Project12, Quiz } from '../fusion.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder,FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Mentor1Service } from '../mentor1.service';
import { environment } from '../../environments/environment';
import { Fusion2Service } from '../fusion2.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';


async function urlToFile(url: string, filename: string, mimeType: string) {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], filename, { type: mimeType });
}
interface Video234 {
  id: number;
  title: string;
  url: string;
  description?: string;
  videoTitle: string;
  videoDescription: string;
  s3Url: string;
}

interface Lesson {
  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: number;
  editingTitle?: boolean;
  editingContent?: boolean;
  editingDescription: boolean;
  editingObjective?: boolean;
  originalObjective?: string;
  videos?: any[];
  pdfs?: any[];
  quizzes?: string[];
  assignments?: string[];
  objective?: string;
}
interface Lesson2 {
  id?: number; // Add the id property
  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: number;
  // uploadSets: UploadSet[];

}
interface LessonWithUploads extends Lesson3 {
  uploadSets: UploadSet[];
  videos?: Video234[];
  // Add the videos property here
  isVideosFetched?: boolean; // New property to track if videos were fetched
}
interface UploadSet {
  videoFiles: File[];
  videoDescriptions: string[];
}
interface Lesson3 {


  lessonId?: number; // Add lessonId here

  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: number;
  // uploadSets: UploadSet[];

}

////////add Quiz//////

interface Question {
  text: string;
  type: string;
  options: Option[];
  correctAnswer: string;
}

interface Option {
  label: string;
  text: string;
}

///////////////////////

export interface Module {
  moduleId?: number;
  name: string;
  lessons: LessonWithUploads[];
}
///////////// Celebrations////////////////
interface FlowerPetal {
  cx: number;
  cy: number;
  transform: string;
}

interface Flower {
  petals: FlowerPetal[];
  color: string;
  petalColor: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
}
interface CelebrationItem {
  type: string;
  color: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
  size: number;
  strokeWidth: string; // Add this new property

}

@Component({
  selector: 'app-course-create-mentor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './course-create-mentor.component.html',
  styleUrl: './course-create-mentor.component.css'
})
export class CourseCreateMentorComponent implements OnInit {
  formSubmitted: boolean;
  addQuestion() {
    throw new Error('Method not implemented.');
  }
  addAnswer(_t911: number) {
    throw new Error('Method not implemented.');
  }
  removeAnswer(_t911: number, _t922: number) {
    throw new Error('Method not implemented.');
  }
  removeQuestion(_t911: number) {
    throw new Error('Method not implemented.');
  }

  courseId: any;
  lessonId: any;
  lessonModuleId: any;
  ////////// assignment /////////////////////
  assignmentForm: FormGroup;
  assignmentTitle: string = '';
  assignmentTopicName: string = '';
  startDate: string = '';
  endDate: string = '';
  selectedFile: File | null = null;
  fileName: string = 'No file chosen';
  isPopupVisible: boolean = false; // Control popup visibility

  // Static lessonId and courseId for testing


  // Mock data for charts
  courseDistribution = [
    { name: 'Course A', students: 30 },
    { name: 'Course B', students: 25 },
    { name: 'Course C', students: 20 },
    { name: 'Course D', students: 35 },
    { name: 'Course E', students: 10 }
  ];

  upcomingClassesList = [
    { name: 'Introduction to Angular', date: '2024-07-12', time: '10:00 AM' },
    { name: 'Advanced CSS Techniques', date: '2024-07-13', time: '2:00 PM' },
    { name: 'Web Security Fundamentals', date: '2024-07-14', time: '11:00 AM' }
  ];

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  currentTab: string = 'courselanding';
  alertMessage: string = '';
  alertType: 'success' | 'error' | '' = '';

  usersId: any;
  Id: any;
  coursesId: any;
  courseForm!: FormGroup;
  id: any;
  data: any;
  userId: string = '';
  private subscriptions: Subscription = new Subscription();

  minDate: string | undefined;



  formErrors = {
    tools: false,
    skills: false,
    prerequisites: false
  };


  // course
  courseTitle: string = '';
  courseType: string = '';
  courseTerm: string = '';

  // courseType: string = 'online'; // Set a default value if necessary

  // Ensure this line is present
  level: string = '';
  courseDescription: string = '';
  courseLanguage: string = '';
  courseDuration: number = 0;
  editingDuration: boolean = false;

  durationUnit: string = '';
  tempDuration: number = 0;
  tempDurationUnit: string = '';
  newWhyEnroll: string = '';
  whyEnrolls: string[] = [];
  editingTitle: boolean = false;
  isEditingDescription: boolean = false;
  isEditingDuration: boolean = false;
  editingWhyEnrollIndex: number | null = null;

  editingWhyEnroll: string = '';
  courseImage: any;

  //////////////////////////////////////lesson/////////////////
  lessons: any[] = [];
  lessons2: Lesson2[] = [];

  lesson: any = {};
  editingStates: { [key: number]: { title: boolean; content: boolean; description: boolean } } = {};

  duration: number = 0;

  // prerequisites

  newPrerequisites: string = '';
  editingPrerequisitesIndex: number = -1;
  editingPrerequisites: string = '';
  toolName: string = '';
  toolImage: any;

  skillName: any;
  skillImage: any;
  coursePrerequisites: any;

  // What You'll Learn
  learningItems: string[] = [];
  newLearningItem: string = '';
  editingLearningIndex: number = -1;
  editingLearningItem: string = '';

  // curriculum
  newVideoTitle: string = '';
  newPdfTitle: string = '';
  editingVideoIndex: { lesson: number, video: number } | null = null;
  editingPdfIndex: { lesson: number, pdf: number } | null = null;
  newObjective: string = '';
  newQuiz: string = '';
  newAssignment: string = '';
  // courselanding
  whyEnroll: string = '';
  shortVideoUrl: any;
  demoVideoUrl: any;
  editingShortVideo: boolean = false;
  tempShortVideoUrl: string | null = null;
  editingDemoVideo: boolean = false;
  tempDemoVideoUrl: string | null = null;
  description: string = '';
  editedObjective: string = '';
  isEditing: boolean = true;
  currency: string = ''; // Provide a default value
  courseFeeError: string = '';
  discountError: string = '';
  courseFee: number = 0; // Provide a default value
  discountPercentage: number = 0; // Provide a default value
  expirationDate: string = ''; // Provide a default value
  discountCoupons: { code: string; discountPercentage: number; expirationDate: string; isEditing: boolean; }[] = []; // Array to hold generated coupons
  promotions: number = 0;
  couponCode: string = '';
  promoCode!: string; // Variable to store the fetched promo code
  isEditingCurrency: boolean = false;
  isEditingCourseFee: boolean = false;
  editDiscountPercentage: boolean = false; // Corrected property name
  isEditingDiscountPercentage: boolean = false; // Ensure this property is defined
  isEditingPromotions: boolean = false;
  isEditingCouponCode: boolean = false;

  discountedFee: number = 0;
  totalAmount: number = 0;
  // New properties for project
  newProjectTitle: string = '';
  newProjectDescription: string = '';
  newprojectDeadline: string = '';


  projectTitle: string = '';
  projectDescription: string = '';
  projectDeadline: string = '';
  projectDocumentName: string = ''; // Assuming this is where you store the document file name
  pastDateWarning: boolean = false;


  document: any;
  projects: any[] = [];
  moduleId: any;
  lessonid!: number;




  //////////add Quiz //////////


  quizName: string = '';
  showQuiz = false;
  score = 0;
  questionCount = 0;
  questions: any[] = [];
  isQuizCreated: boolean = false;
  showOverlay: boolean = false;
  /////////////////////////////
  projectForm: FormGroup;
  //pricing/////////


  constructor(
    private mentor1service: Mentor1Service,
    private fusionService: FusionService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private fusion2service: Fusion2Service
  ) {

    this.formSubmitted = false;
    this.assignmentForm = this.fb.group({
      assignmentTitle: ['', Validators.required],
      assignmentTopicName: ['', Validators.required],
      startDate: ['', [Validators.required, this.validateStartDate]],
      endDate: ['', [Validators.required, this.validateEndDate.bind(this)]],
      reviewMeetDate: ['', [Validators.required, this.validateReviewMeetDate.bind(this)]],
      file: [null, Validators.required]
    });

    // -------p---
    this.assignmentForm.get('startDate')?.valueChanges.subscribe(() => {
      this.assignmentForm.get('endDate')?.updateValueAndValidity();
      this.assignmentForm.get('reviewMeetDate')?.updateValueAndValidity();
    })

    this.projectForm = this.fb.group({
      newProjectTitle: [
        '',
        [
          Validators.required,
          Validators.minLength(5), // Minimum 5 characters
          Validators.maxLength(50) // Maximum 50 characters
        ]
      ],
      newProjectDescription: ['', [
        Validators.required,
        Validators.minLength(5), // Minimum 10 characters
        Validators.maxLength(1000) // Maximum 300 characters
      ]
      ],
      newprojectDeadline: ['', Validators.required],
      document: ['', Validators.required],
      documentUrl: [''] // For preview URL
    });

    this.prerequisitesForm = this.fb.group({
      prerequisites: this.fb.array([])
    });

  }


  ngOnInit(): void {

    console.log('Component initialized');

    this.minDate = new Date().toISOString().split('T')[0];

    this.generateCelebrationItems();

    this.triggerCelebration();

    this.getLessons();

    // Retrieve courseId from the route parameters
    this.route.params.subscribe(params => {
      this.courseId = +params['id']; // Convert to number using '+'
      console.log('Course ID:', this.courseId);
    });

    this.route.params.subscribe(params => {
      this.courseId = +params['id']; // Convert to number using '+'
      this.getLessons();
    });

    // Fetch courseId from the navigation URL
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchModules();
    this.loadDocuments();

    // Fetch data from backend
    this.getCourseToolsData();
    this.getCourseFeeDetails(this.courseId);
    this.route.params.subscribe(params => {
      const courseId = +params['id']; // The '+' converts the string to a number
      if (courseId) {
        this.getProjectDetails(courseId);
      } else {
        console.error('No courseId found in URL');
        // Handle the error appropriately, maybe redirect to a 404 page or show an error message
      }
    });

    this.fetchCourseData();
    this.route.params.subscribe(params => {
      this.courseId = +params['id']; // Convert to number
      this.loadCourseData();
    });
    this.route.paramMap.subscribe(params => {
      const courseId = +params.get('id')!;
      this.fetchVideoTrailers(courseId);
    });
    this.addTool();
    this.addSkill();
    this.addPrerequisite();
    this.calculateCompletionPercentage();
    this.usersId = localStorage.getItem('id');

    this.courseForm = this.fb.group({
      courses: this.fb.array([this.createCourseGroup()])
    });

    this.subscriptions.add(
      this.authService.getNameObservable().subscribe(id => {
        this.id = id;
      })
    );
    this.subscriptions.add(
      this.authService.getNameObservable().subscribe(id => {
        this.id = id;
        this.userId = id ?? ''; // Assign id to userId, handling null or undefined
      })
    );
    this.route.params.subscribe(params => {
      this.courseId = +params['id']; // Ensure courseId is a number
      console.log('Initialized Course ID:', this.courseId); // Debug statement
    });
    const now = new Date();
    this.currentDateTime = now.toISOString().slice(0, 16); // Format for datetime-local input


    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
  }

  // ---- project adding below  ------------
  onDeadlineChange(event: any) {
    const selectedDate = new Date(event.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure comparison is for dates only.

    if (selectedDate < today) {
      this.pastDateWarning = true;
      this.projectForm.controls['newprojectDeadline'].setErrors({ pastDate: true });
    } else {
      this.pastDateWarning = false;
      this.projectForm.controls['newprojectDeadline'].setErrors(null);
    }
  }

  addProject() {
    if (this.projectForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const { newProjectTitle, newProjectDescription, newprojectDeadline } =
      this.projectForm.value;

    this.fusionService
      .addProject(
        this.courseId,
        newProjectTitle,
        newProjectDescription,
        newprojectDeadline,
        this.document
      )
      .subscribe(
        {next:(response) => {
          console.log('Project added successfully:', response);
          alert('Project added successfully');
        },
        error:(error) => {
          console.error('Error adding project:', error);
          alert('Error adding project');
        }}
      );
  }


  onNewProjectDocumentSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Allowed file types
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, DOC, and DOCX files are allowed!');
        input.value = ''; // Reset file input field
        return;
      }

      this.document = file;
      this.projectForm.patchValue({ document: this.document });
      this.projectForm.get('document')?.updateValueAndValidity();
    }
  }


  currentDateTime: string | undefined;


  // All methiods

  setCurrentTab(tab: string): void {
    this.currentTab = tab;
  }
  // course methodes
  startEditTitle() {
    this.editingTitle = true;
  }

  saveEditTitle() {
    this.editingTitle = false;
    this.onFieldChange();
  }

  cancelEditTitle() {
    this.editingTitle = false;
  }
  startDescriptionEditing() {
    this.isEditingDescription = true;

  }

  onToolPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.toolImage = file;  // Store the File object directly
    }
  }
  // What You'll Learn Methods
  addLearningItem() {
    if (this.learningItems.length < 8 && this.newLearningItem.trim() !== '') {
      this.learningItems.push(this.newLearningItem.trim());
      this.newLearningItem = '';
    }
  }

  editLearningItem(index: number) {
    this.editingLearningIndex = index;
    this.editingLearningItem = this.learningItems[index];
  }

  saveLearningItem(index: number) {
    if (this.editingLearningItem.trim() !== '') {
      this.learningItems[index] = this.editingLearningItem.trim();
      this.editingLearningIndex = -1;
    }
  }

  removeLearningItem(index: number) {
    this.learningItems.splice(index, 1);
    if (this.editingLearningIndex === index) {
      this.editingLearningIndex = -1;
    }
  }

  // curriculum Methods

  addLesson() {
    const newLesson: Lesson = {
      lessonTitle: '',
      lessonContent: '',
      lessonDescription: '',
      lessonDuration: 0,
      editingDescription: false,
      videos: [],
      pdfs: [],
      quizzes: [],
      assignments: [],
      objective: ''
    };

    this.lessons.push(newLesson);
  }
  // editlesson


  startEditLessonTitle(index: number) {
    this.lessons[index].editingTitle = true;
  }

  saveLessonTitle(index: number) {
    this.lessons[index].editingTitle = false;
  }

  cancelEditLessonTitle(index: number) {
    this.lessons[index].editingTitle = false;
  }

  startEditLessonContent(index: number) {
    this.lessons[index].editingContent = true;
  }

  saveLessonContent(index: number) {
    this.lessons[index].editingContent = false;
  }

  cancelEditLessonContent(index: number) {
    this.lessons[index].editingContent = false;
  }
  startEditLessonDescription(index: number) {
    this.lessons[index].editingDescription = true; // Start editing
  }

  saveLessonDescription(index: number) {
    this.lessons[index].editingDescription = false; // Save changes
    // Add logic to save the lesson description to the backend if needed
  }

  cancelEditLessonDescription(index: number) {
    this.lessons[index].editingDescription = false; // Cancel editing
    // Add logic to revert changes if needed
  }
 

  resetLessonForm() {
    this.lesson = {
      lessonTitle: '',
      lessonContent: '',
      lessonDescription: '',
      lessonDuration: 0,
      editingDescription: false,
      videos: [],
      pdfs: [],
      quizzes: [],
      assignments: [],
      objective: ''
    };
  }




  // lesson Objective methods

  startEditObjective(index: number) {
    this.lessons[index].editingObjective = true;
    this.lessons[index].originalObjective = this.lessons[index].objective;
  }
  saveObjective(index: number) {
    this.lessons[index].editingObjective = false;

  }
  cancelEditObjective(index: number) {
    this.lessons[index].objective = this.lessons[index].originalObjective;
    this.lessons[index].editingObjective = false;
  }


  createLesson() {

  }

  removeLesson(index: number) {
    this.lessons.splice(index, 1);
  }
  saveLesson(index: number): void {
    const lesson = this.lessons[index];
    // Implement the logic to save the lesson
    console.log(`Saving lesson ${index + 1}:`, lesson);

    // Simulate an API call with a chance of failure
    const success = Math.random() < 0.8; // 80% chance of success

    if (success) {
      alert(`Lesson ${index + 1} saved successfully!`);
    } else {
      alert(`Failed to save Lesson ${index + 1}. Please try again.`);
    }
  }
  onVideoUpload(event: Event, lessonIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
    }
  }
  onPdfUpload(event: Event, lessonIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
    }
  }
  removePdf(lessonIndex: number, pdfIndex: number): void {
  }



  removeVideo(lessonIndex: number, videoIndex: number): void {
  }

  editPdf(lessonIndex: number, pdfIndex: number) {
    this.editingPdfIndex = { lesson: lessonIndex, pdf: pdfIndex };
  }
  savePdf(lessonIndex: number, pdfIndex: number) {
    this.editingPdfIndex = null;
  }
  addQuiz(lessonIndex: number) {
    if (this.newQuiz.trim()) {
      this.newQuiz = '';
    }
  }
  removeQuiz(lessonIndex: number, quizIndex: number) {
  }
  addAssignment(lessonIndex: number) {
    if (this.newAssignment.trim()) {
      this.newAssignment = '';
    }
  }
  removeAssignment(lessonIndex: number, assignmentIndex: number) {
  }
  // project methods
  editProject(index: number) {
    this.projects[index].editing = true;
    this.projects[index].editTitle = this.projects[index].title;
    this.projects[index].editDescription = this.projects[index].description;
    this.projects[index].editDeadline = this.projects[index].deadline;
    this.projects[index].editDocumentFile = this.projects[index].documentFile;
    this.projects[index].editDocumentFileName = this.projects[index].documentFileName;
  }
  onEditProjectdocumentSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.projects[index].editdocument = file;
      this.projects[index].editdocumentFileName = file.name;
    }
  }
  saveProjectEdit(index: number) {
    const project = this.projects[index];
    project.title = project.editTitle;
    project.description = project.editDescription;
    project.deadline = project.editDeadline;
    project.documentFile = project.editDocumentFile;
    project.documentFileName = project.editDocumentFileName;
    project.editing = false;
  }
  cancelProjectEdit(index: number) {
    this.projects[index].editing = false;
  }

  onProjectdocumentSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.document = event.target.files[0];
    }
  }

  // Custom validator to check that end date is after start date
  validateStartDate(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to the start of the day
    return selectedDate >= today ? null : { invalidDate: true }; // Return error if date is in the past
  }
  validateEndDate(control: AbstractControl) {
    const startDate = this.assignmentForm?.get('startDate')?.value;
    const endDate = control.value;

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return { endDateInvalid: true };
    }
    return null;
  }
  validateReviewMeetDate(control: AbstractControl): { [key: string]: boolean } | null {
    if (!this.assignmentForm) return null; // Skip validation if form is not initialized
    const endDate = new Date(this.assignmentForm.get('endDate')?.value);
    const reviewDate = new Date(control.value);
    return reviewDate >= endDate ? null : { reviewBeforeEnd: true }; // Return error if review date is before start date
  }

  // Custom validator to check that review meet date is after end date
  validateReviewDate(control: AbstractControl) {
    const endDate = this.assignmentForm?.get('endDate')?.value;
    const reviewMeetDate = control.value;

    if (endDate && reviewMeetDate && new Date(reviewMeetDate) <= new Date(endDate)) {
      return { reviewDateInvalid: true };
    }
    return null;
  }
  onFileChange2(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.assignmentForm.patchValue({
        file: this.selectedFile
      });
    } else {
      this.selectedFile = null;
      this.assignmentForm.patchValue({
        file: null
      });
    }
  }
  onSubmit2(): void {
    if (this.assignmentForm.valid && this.selectedFile) {
      const formValues = this.assignmentForm.value;

      // Prepare form data for submission
      const formData = new FormData();
      formData.append('assignmentTitle', formValues.assignmentTitle);
      formData.append('assignmentTopicName', formValues.assignmentTopicName);
      formData.append('startDate', formValues.startDate);
      formData.append('endDate', formValues.endDate);
      formData.append('reviewMeetDate', formValues.reviewMeetDate);
      formData.append('file', this.selectedFile);

      // Simulate submission (replace with actual service call)
      console.log('Form submitted with values: ', formValues);
      console.log('Selected file: ', this.selectedFile);

      // Reset the form
      this.assignmentForm.reset();
      this.selectedFile = null;
    } else {
      alert('Please fill in all fields and select a valid file.');
    }
  }
  /////// fetch project 


  selectedProject: Project12 | null = null;
  documentUrl: SafeResourceUrl | null = null; // Document preview URL



  // Fetch project details by courseId and enable update mode
  getProjectDetails(courseId: number): void {
    this.fusionService.getProjectsByCourse(courseId).subscribe(
      {next:(projects: Project12[]) => {
        this.projects = projects;
        if (this.projects.length > 0) {
          this.selectedProject = this.projects[0]; // Select the first project by default

          if (this.selectedProject) {
            this.patchProjectForm(this.selectedProject); // Patch the form with project data
          }
        }
      },
      error:(error) => {
        console.error('Error fetching projects:', error);
      }}
    );
  }
  /////////////// update project ////////////

  updateProject(): void {
    if (!this.selectedProject) return;

    // Extract form values
    const {
      newProjectTitle,
      newProjectDescription,
      newProjectDeadline,
      reviewMeetDate,
      maxTeam,
      gitUrl,
    } = this.projectForm.value;

    const document: File = this.projectForm.get('document')?.value;

    // Prepare FormData object
    const formData = new FormData();

    // Append fields only if they are provided (non-null)
    if (newProjectTitle) {
      formData.append('projectTitle', newProjectTitle);
    }
    if (newProjectDescription) {
      formData.append('projectDescription', newProjectDescription);
    }
    if (newProjectDeadline) {
      const deadlineISO = new Date(newProjectDeadline).toISOString(); // Convert date to ISO format
      formData.append('projectDeadline', deadlineISO);
    }
    if (reviewMeetDate) {
      const reviewMeetISO = new Date(reviewMeetDate).toISOString(); // Convert date to ISO format
      formData.append('reviewMeetDate', reviewMeetISO);
    }
    if (maxTeam) {
      formData.append('maxTeam', maxTeam.toString()); // Convert number to string
    }
    if (gitUrl) {
      formData.append('gitUrl', gitUrl);
    }

    // Append project document if provided
    if (document) {
      formData.append('projectDocument', document);
    }

    // Call the service to update the project
    this.fusionService.updateProjects(this.selectedProject.id!, formData).subscribe(
      {next:response => {
        console.log('Project updated successfully:', response);
        this.updatePercentage();  // Update any percentage or UI after successful update
        this.setCurrentTab('pricing');  // Switch to another tab if needed
      },
      error:(error) => {
        console.error('Error updating project:', error);
      }}
    );
  }



  // Convert projectDeadline array to YYYY-MM-DD string
  convertDateArrayToISO(dateArray: number[]): string {
    const [year, month, day] = dateArray;
    return `${year}-${this.pad(month)}-${this.pad(day)}`;
  }

  // Add leading zero for single-digit months and days
  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  // Patch form with selected project data
  patchProjectForm(project: Project12): void {
    this.projectForm.patchValue({
      newProjectTitle: project.projectTitle || '',
      newProjectDescription: project.projectDescription || '',
      newprojectDeadline: project.projectDeadline ? this.convertDateArrayToISO(project.projectDeadline) : '',
      document: null, // File input can't be patched, so left as null
    });
    this.documentUrl = project.projectDocument ? this.sanitizeUrl(this.getDocumentUrl(project.projectDocument)) : null;
  }

  // Generate document URL for preview
  getDocumentUrl(documentData: string): string {
    try {
      const binaryData = atob(documentData);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error generating document URL:', error);
      return '';
    }
  }

  // Sanitize the URL for preview
  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Download the document
  downloadDocument(documentData: string) {
    const binaryData = atob(documentData);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.pdf'; // Adjust the file name and extension as needed
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /////////////////////////////////////////////////////////////

  // courselanding methods
  //  courseDuration
  startEditingDuration(): void {
    this.isEditingDuration = true;
    this.tempDuration = this.duration;
    this.tempDurationUnit = this.durationUnit;
    this.editingDuration = true;

  }
  saveEditingDuration() {
    this.editingDuration = false;
    // Save logic here
  }

  saveDuration(): void {
    this.duration = this.tempDuration;
    this.durationUnit = this.tempDurationUnit;
    this.isEditingDuration = false;
    this.onFieldChange();

  }
  cancelEditingDuration(): void {
    this.isEditingDuration = false;
    this.tempDuration = 0;
    this.tempDurationUnit = 'hours';
    this.editingDuration = false;

  }

  //  courseObjective
  startCourseEditing() {
    this.isEditing = true;
    this.editedObjective = this.description;
  }

  saveDescription() {
    this.isEditingDescription = false;

    // Add any additional logic if needed
  }


  cancelDescriptionEditing() {
    this.isEditing = false;
    this.editedObjective = '';

  }



  // courselanding short video
  onShortVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.shortVideoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  startEditShortVideo() {
    this.editingShortVideo = true;
    this.tempShortVideoUrl = this.shortVideoUrl;
  }
  onEditShortVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempShortVideoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  saveShortVideo() {
    this.shortVideoUrl = this.tempShortVideoUrl;
    this.editingShortVideo = false;
  }

  cancelEditShortVideo() {
    this.tempShortVideoUrl = null;
    this.editingShortVideo = false;
  }
  deleteShortVideo() {
    this.shortVideoUrl = null;
    this.tempShortVideoUrl = null;
    this.editingShortVideo = false;
  }
  // courselanding long video

  onDemoVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.demoVideoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  startEditDemoVideo() {
    this.editingDemoVideo = true;
    this.tempDemoVideoUrl = this.demoVideoUrl;
  }

  onEditDemoVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempDemoVideoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  saveDemoVideo() {
    this.demoVideoUrl = this.tempDemoVideoUrl;
    this.editingDemoVideo = false;
  }

  cancelEditDemoVideo() {
    this.tempDemoVideoUrl = null;
    this.editingDemoVideo = false;
  }
  deleteDemoVideo() {
    this.demoVideoUrl = null;
    this.tempDemoVideoUrl = null;
    this.editingDemoVideo = false;
  }

  onCourseImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(input)

    if (input.files && input.files.length > 0) {
      this.courseImage = input.files[0];
      console.log(this.courseImage)
      this.onFieldChange();
    }
    else {
      alert("Image not added successfully!!!")
    }
  }
  editCourseImage(): void {
    const input = document.getElementById('courseImage') as HTMLInputElement;
    input.click();
  }

  deleteCourseImage(): void {
    this.courseImage = null;
    const input = document.getElementById('courseImage') as HTMLInputElement;
    input.value = '';
  }


  // Why Enroll Methods

  addWhyEnroll() {
    if (this.whyEnrolls.length < 8 && this.newWhyEnroll.trim() !== '') {
      this.whyEnrolls.push(this.newWhyEnroll.trim());
      this.newWhyEnroll = '';
      this.onFieldChange();
    }
  }

  editWhyEnroll(index: number) {
    this.editingWhyEnrollIndex = index;
    this.editingWhyEnroll = this.whyEnrolls[index];
  }

  saveWhyEnroll(index: number) {
    if (this.editingWhyEnroll.trim() !== '') {
      this.whyEnrolls[index] = this.editingWhyEnroll.trim();
      this.editingWhyEnrollIndex = null;
      this.editingWhyEnroll = '';
      this.onFieldChange();
    }
  }

  removeWhyEnroll(index: number) {
    this.whyEnrolls.splice(index, 1);
    this.onFieldChange();
  }
  prepareDataForBackend(): any {
    const backendData: any = {};
    this.whyEnrolls.forEach((item, index) => {
      if (index < 8) {
        backendData[`level_${index + 1}`] = item;
      }
    });
    return backendData;
  }



  // }
  calculateDiscount() {

    if (this.courseFee && this.discountPercentage) {
      const discountAmount = this.courseFee * (this.discountPercentage / 100);
      console.log(`Discount: ${discountAmount}`);
    }
    this.calculateCompletionPercentage();

  }
 

  generateDiscount() {
    if (!this.expirationDate) {
      alert('Please select an expiration date.');
      return;
    }

    // Generate a random coupon code
    const newCouponCode = this.generateCouponCode();
    this.discountCoupons.push({ code: newCouponCode, discountPercentage: this.discountPercentage, expirationDate: this.expirationDate, isEditing: false });
  }



  private generateCouponCode(): string {
    // Simple example of generating a random coupon code
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Methods for editing each field
  editCurrency() {
    // Logic to edit currency
    console.log('Edit Currency:', this.currency);
  }
  editCourseFee() {
    // Logic to edit course fee
    console.log('Edit Course Fee:', this.courseFee);
  }




  // Placeholder for your form data
  formData: any = {}; // Replace with your actual form data structure


  // Method to save current tab data
  saveCurrentTab() {
    // Simulating saving data to formData object
    this.formData[this.currentTab] = `Data saved for ${this.currentTab}`;
    // Showing alert after saving
    alert(`Data saved for ${this.currentTab}`);
  }

  // Go to Next Tab
  goToNextTab() {
    this.saveCurrentTab();
    if (this.currentTab === 'courselanding') {
      this.setCurrentTab('planning');
    } else if (this.currentTab === 'planning') {
      this.setCurrentTab('curriculum');
    } else if (this.currentTab === 'curriculum') {
      this.setCurrentTab('pricing');
    }
  }

  // Go to Previous Tab
  goToPreviousTab() {
    if (this.currentTab === 'pricing') {
      this.setCurrentTab('lesson');
    } else if (this.currentTab === 'lesson') {
      this.setCurrentTab('planning');
    } else if (this.currentTab === 'planning') {
      this.setCurrentTab('courselanding');
    }
  }

  // Method to determine if Next button should be hidden
  shouldHideNextButton(): boolean {
    return this.currentTab === 'pricing';
  }

  // Method to determine if Previous button should be hidden
  shouldHidePreviousButton(): boolean {
    return this.currentTab === 'courselanding';
  }
  shouldShowFirstSubmitButton(): boolean {
    return this.currentTab === 'planning';
  }
  //// pricing promotions tab course fee feild ts : line 1547 replace 

  validateAndProcessCourseFee(value: number) {
    // Reset previous error
    this.courseFeeError = '';

    // Check for negative or zero values
    if (value <= 0) {
      this.courseFeeError = 'Course fee must be a positive number greater than zero.';
      this.courseFee = 0; // Reset to 0 if invalid
    } else if (value > 1000000000000) {
      this.courseFeeError = 'Course fee should not exceed 1,000,000,000,000.';
    } else {
      this.courseFee = value;
      this.calculateDiscount();
    }
    this.onFieldChange();
  }

  validateAndProcessDiscountPercentage(value: number) {
    // Reset previous error
    this.discountError = '';

    // Check for negative or out of range values
    if (value < 0) {
      this.discountError = 'Discount percentage cannot be negative.';
      this.discountPercentage = 0; // Reset to 0 if invalid
    } else if (value > 100) {
      this.discountError = 'Discount percentage cannot exceed 100%.';
      this.discountPercentage = 100; // Cap at 100%
    } else {
      this.discountPercentage = value;
      this.calculateDiscount();
    }
    this.onFieldChange();
  }
  shouldShowSecondSubmitButton(): boolean {

    return this.currentTab === 'pricing';

  }

  loadCourseData() {
    if (this.courseId) {
      this.fusionService.getCourseById(this.courseId).subscribe(
        {next:(courseData) => {
          // Populate form fields with existing course data
          this.level = courseData.level;
          this.courseType = courseData.courseType;
          this.courseTerm = courseData.courseTerm;
          this.courseDescription = courseData.courseDescription;
          this.whyEnrolls = [
            courseData.level_1, courseData.level_2, courseData.level_3,
            courseData.level_4, courseData.level_5, courseData.level_6,
            courseData.level_7, courseData.level_8
          ].filter(item => item); // Remove empty entries
          this.courseDuration = courseData.courseDuration;
          this.courseLanguage = courseData.courseLanguage;
          // ... populate other fields as needed
        },
        error:(error) => {
          console.error('Error loading course data', error);
          alert('Error loading course data. Please try again.');
        }}
      );
    }
  }
  get showCourseDurationLongTermError(): boolean {
    return (
      this.formSubmitted &&
      this.courseTerm === 'long' &&
      (!this.courseDuration || +this.courseDuration <= 4)
    );
  }
  submitFirstSet5() {
    console.log('submitFirstSet5 called');
    this.formSubmitted = true;
    this.cdr.detectChanges();

    if (!this.isFormValid2()) {
      console.log('Form is not valid');
      return;
    }

    console.log('Preparing course data');
    const courseData = new FormData();
    courseData.append('courseDescription', this.courseDescription);
    courseData.append('courseLanguage', this.courseLanguage);
    courseData.append('level', this.level);
    courseData.append('level_1', this.whyEnrolls[0] || '');
    courseData.append('level_2', this.whyEnrolls[1] || '');
    courseData.append('level_3', this.whyEnrolls[2] || '');
    courseData.append('level_4', this.whyEnrolls[3] || '');
    courseData.append('level_5', this.whyEnrolls[4] || '');
    courseData.append('level_6', this.whyEnrolls[5] || '');
    courseData.append('level_7', this.whyEnrolls[6] || '');
    courseData.append('level_8', this.whyEnrolls[7] || '');
    courseData.append('courseDuration', this.courseDuration.toString());
    courseData.append('courseType', this.courseType);
    courseData.append('courseTerm', this.courseTerm);
    courseData.append('coursePercentage', this.coursePercentage);


    if (this.CourseImageFile) {
      courseData.append('courseImage', this.CourseImageFile);
    }

    console.log(courseData);

    if (!this.courseId) {
      console.error('Course ID is missing');
      alert('Error: Course ID is missing. Please try again.');
      return;
    }

    console.log('Calling updateCourseById with courseId:', this.courseId);

    this.fusionService.updateCourseById(this.courseId, courseData).subscribe(
      {next:(response) => {
        this.data = response;
        console.log('Course updated successfully', response);
        alert('Course updated successfully!');
        // Now call the updatePercentage() method after successfully updating the course
        this.updatePercentage();
        this.setCurrentTab('coursetrailer');  // Switch to the 'coursetrailer' tab
      },
      error:(error) => {
        console.error('Error updating course', error);
        alert('Error updating course. Please try again.');
      }}
    );
  }
  //////////////save course Trailer & material/////////////
  saveAllAndNavigate() {
    this.uploadTrailers();
    this.uploadFiles();
    this.setCurrentTab('planning');
  }



  submitSecondSet() {
    // Logic to handle submission for Curriculum and Pricing tabs
    console.log('Submitting second set of data:', {
      curriculum: this.formData['curriculum'],
      pricing: this.formData['pricing']
    });
    // Add your API call or data processing logic here
    alert('Second set of data submitted successfully!');
  }


  CourseImageFile!: File;
  onCourseImageSelected1(event: any): void {
    const file = event.target.files[0];

    this.CourseImageFile = event.target.files[0];

    console.log(event.target.files);

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed!');
        event.target.value = ''; // Reset the file input field
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.courseImage = reader.result as string; // Set the image as a data URL
        console.log(this.courseImage)
      };
      reader.readAsDataURL(file);

      this.onFieldChange(); // Call the relevant field change handler
    }
  }

  addCourseImage(): void {
    // Logic to add a new course image or related functionality
    console.log("Add Course Image button clicked");
  }





  onFileSelected2(event: any) {
    this.skillImage = event.target.files[0];
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.skillImage = input.files[0];
      this.onFieldChange();
    }
  }
 
  submitProject() {
    // This method is no longer needed as projects are submitted individually
    alert('All projects have been submitted successfully!');
  }
  onEditProjectDocumentSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.projects[index].editDocumentFile = file;
      this.projects[index].editDocumentFileName = file.name;
    }
  }

  submitProjects() {
    // Add your logic for submitting projects
    console.log('Projects submitted:', this.projects);
  }
  clearNewProjectFields() {
    this.newProjectTitle = '';
    this.newProjectDescription = '';
    this.newprojectDeadline = '';
    this.document = null;
  }
  toggleEdit(field: string) {
    if (field === 'currency') {
      this.isEditingCurrency = !this.isEditingCurrency;
    } else if (field === 'courseFee') {
      this.isEditingCourseFee = !this.isEditingCourseFee;
    } else if (field === 'discountPercentage') {
      this.isEditingDiscountPercentage = !this.isEditingDiscountPercentage; // Toggle the correct property
    }
  }

  createCoupon() {
    // Check if all required fields are filled
    if (!this.discountPercentage || !this.expirationDate || !this.courseFee || !this.currency) {
      alert('Please fill all the required details');
      return;
    }

    // Validate expiration date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize to midnight to ignore time

    const selectedDate = new Date(this.expirationDate);
    selectedDate.setHours(0, 0, 0, 0); // Normalize to midnight to ignore time

    if (selectedDate < currentDate) {
      alert('Please select today or a future date for expiration');
      return;
    }

    const expirationDateISO = new Date(this.expirationDate).toISOString();

    this.fusionService.createCoupons(
      this.courseId,
      this.discountPercentage,
      expirationDateISO,
      this.courseFee,
      this.currency,
    ).subscribe(
      {next:(response) => {
        console.log('Coupon created successfully:', response);
        this.discountCoupons.push({
          code: response.couponCode,
          discountPercentage: this.discountPercentage,
          expirationDate: this.expirationDate,
          isEditing: false
        });
        alert('Coupon created successfully!');

        // Now call the updatePercentage() method after successfully updating the course
        this.updatePercentage();
        // Navigate to the MentorPerspectiveComponent after success
        this.router.navigate(['/mentorperspective', ""]);
      },
      error:(error) => {
        console.error('Error creating coupon:', error);
        alert('Error creating coupon. Please try again.');
      }}
    );
  }


  toggleEditExpirationDate(index: number) {
    this.discountCoupons[index].isEditing = !this.discountCoupons[index].isEditing;
  }

  deleteCouponCode(index: number) {
    this.discountCoupons.splice(index, 1);
  }
  getCourseFeeDetails(id: number): void {
    this.fusionService.getCourseFeeDetails(this.courseId).subscribe((course) => {
      this.currency = course.currency;
      this.courseFee = course.courseFee;
      this.discountPercentage = course.discountPercentage;
      this.expirationDate = course.promoCodeExpiration;
      this.promoCode = course.promoCode

    });
  }

  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
      this.alertType = '';
    }, 5000); // Hide alert after 5 seconds
  }

  addNewLesson() {
    this.lessons2.push({
      lessonTitle: '',
      lessonContent: '',
      lessonDescription: '',
      lessonDuration: 0
    });
  }

  generateLesson(index: number) {
    const lesson: Lesson2 = this.lessons2[index];

    if (!lesson.lessonTitle || lesson.lessonTitle.trim() === '') {
      this.showAlert('Lesson title is required and cannot be empty.', 'error');
      return;
    }

    // Trim all string fields
    const lessonToSend: Lesson2 = {
      lessonTitle: lesson.lessonTitle.trim(),
      lessonContent: lesson.lessonContent?.trim() || '',
      lessonDescription: lesson.lessonDescription?.trim() || '',
      lessonDuration: lesson.lessonDuration || 0.


    };

    console.log('Creating lesson:', lessonToSend);

    this.fusionService.createLesson(lessonToSend, this.courseId).subscribe(
      {next:(response) => {
        this.lessonId = response.id;
        console.log('Lesson created successfully', response);
        this.showAlert('Lesson created successfully!', 'success');
        this.lessons2[index] = {
          lessonTitle: '',
          lessonContent: '',
          lessonDescription: '',
          lessonDuration: 0
        };

        // Fetch videos for the created lesson
        this.getVideosByLessonId(this.lessonId);
      },
      error:(error) => {
        console.error('Error creating lesson', error);
        this.showAlert('Error creating lesson. Please ensure all required fields are filled.', 'error');
      }}
    );
  }
  lessonToSend(lessonToSend: any, courseId: any) {
    throw new Error('Method not implemented.');
  }
  createContent(index: number) {
    // Logic to handle content creation for the lesson
    console.log('Creating content for lesson:', index + 1);
  }
  /////////////// get short lessons ////////////////////


  getLessons(): void {
    this.fusionService.getLessonsByCourseId(this.courseId).subscribe(
      {next:(lessons2: Lesson1[]) => {
        this.lessons2 = lessons2;
        console.log('Fetched lessons:', lessons2);

        // Fetch videos for each lesson
        lessons2.forEach((lesson) => {
          this.getVideosByLessonId(lesson.id);
        });
      },
      error:(error: any) => {
        console.error('Error fetching lessons:', error);
      }}
    );
  }



  ////////////////////////////////////////lesson video for course///////////////////////////

  videoFiles: File[] = [];
  videoDescriptions: string[] = [];
  videoDescription: string = '';

  uploadSets: Array<{ videoFiles: File[], videoDescriptions: string[] }> = [
    { videoFiles: [], videoDescriptions: [] }
  ];

  addNewUploadSet(): void {
    this.uploadSets.push({ videoFiles: [], videoDescriptions: [] });
  }



  // Method to handle form submission 
  onSubmitLessonVideo(lessonId: number | undefined): void {
    if (this.courseId && lessonId) {
      // Ensure video descriptions are filled and proceed with upload
      const allDescriptionsFilled = this.uploadSets.every((set: { videoDescriptions: string[] }) =>
        set.videoDescriptions.every((desc: string) => desc.trim() !== '')
      );

      if (allDescriptionsFilled) {
        const formData = new FormData();

        this.uploadSets.forEach((set, setIndex) => {
          set.videoFiles.forEach((file, fileIndex) => {
            formData.append('file', file, file.name);
            formData.append('description', set.videoDescriptions[fileIndex]);
          });
        });

        formData.append('courseId', this.courseId.toString());
        formData.append('lessonId', lessonId.toString());  // Use lessonId from the method parameter

        this.fusionService.uploadVideos(formData, this.courseId, lessonId).subscribe(
          {next:(response) => {
            console.log('Upload successful:', response);

            alert('Upload successful!');
          },
          error:(error) => {
            console.error('Upload failed:', error);
            alert('Upload failed!');
          }}
        );
      } else {
        alert('Please add descriptions for all videos.');
      }
    } else {
      alert('Please ensure Course ID and Lesson ID are set.');
    }
  }



  resetForm() {
    this.uploadSets = [{ videoFiles: [], videoDescriptions: [] }];
  }
  //////////////////// getting short lesson vedios /////////////

  videos: Video234[] = [];
  videosByLessonId: { [lessonId: number]: Video234[] } = {}; // Store videos by lesson ID


  // Method to fetch videos by lessonId
  getVideosByLessonId(lessonId: number): void {
    this.fusionService.getVideosByLessonId(lessonId).subscribe(
      {next:(videos: Video234[]) => {
        this.videosByLessonId[lessonId] = videos; // Store videos for this lesson
        console.log(`Fetched videos for lesson ${lessonId}:`, videos);
      },
      error:(error: any) => {
        console.error('Error fetching videos for lesson ' + lessonId, error);
      }}
    );
  }
  //////////////////// delete short lesson vedios /////////////
  deleteVideo(videoId: number): void {
    this.fusionService.deleteVideo(videoId).subscribe({
      next: (response) => {
        console.log('Video deleted successfully:', response);
        // Optionally refresh the list or perform other actions

        // Show alert after successful deletion
        alert('Video deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting video:', error);
        // Optionally handle errors or display messages to the user
        alert('Error deleting video. Please try again.');
      }
    });
  }

  //////////////////////////////////////////////////////////////////////////// 
  isOffline: boolean = true;
  isOnline: boolean = false; // default to online section visible
  toggleSections(section: string) {
    if (section === 'online') {
      this.isOnline = true;
      this.isOffline = false;
    } else if (section === 'offline') {
      this.isOnline = false;
      this.isOffline = true;
    }
  }

  completionPercentage: any;


  courseModules: any[] = []; // Replace 'any[]' with your specific type if known
  courseCoupons: any[] = []; // Replace 'any[]' with your specific type if known


  calculateCompletionPercentage() {
    let filledFields = 0;
    let totalFields = 15; // Total number of fields to be filled including new sections

    // General course fields
    if (this.courseTitle) filledFields++;
    if (this.level) filledFields++;
    if (this.courseTerm) filledFields++;
    if (this.courseDescription) filledFields++;
    if (this.courseImage) filledFields++;
    if (this.whyEnrolls.length > 1) filledFields++;
    if (this.courseDuration) filledFields++;
    if (this.courseType) filledFields++;
    if (this.courseLanguage) filledFields++;

    // Tool and skill fields
    if (this.tools && this.tools.length > 0) {
      for (let tool of this.tools) {
        if (tool.name) {
          filledFields++;
        }
        if (tool.image) {
          filledFields++;
        }
      }
    }
    if (this.skills && this.skills.length > 0) {
      for (let skill of this.skills) {
        if (skill.name) {
          filledFields++;
        }
        if (skill.image) {
          filledFields++;
        }
      }
    }

    if (this.currency) filledFields++;
    if (this.courseFee) filledFields++;

    // Project section
    const projectForm = this.projectForm;
    if (projectForm) {
      totalFields += 4; // Add 4 to total fields for project section
      if (projectForm.get('newProjectTitle')?.value) filledFields++;
      if (projectForm.get('newProjectDescription')?.value) filledFields++;
      if (projectForm.get('newprojectDeadline')?.value) filledFields++;
      if (projectForm.get('document')?.value) filledFields++;
    }

    // Calculate completion percentage
    this.completionPercentage = Math.round((filledFields / totalFields) * 100);
    this.completionPercentage = this.completionPercentage >= 100 ? 100 : this.completionPercentage;
    console.log(this.completionPercentage);
  }


  addNewModule() {
    this.courseModules.push({ moduleTitle: '', moduleDescription: '' });
    this.calculateCompletionPercentage(); // Recalculate percentage
  }
  toggleEditPricing(field: string) {
    const editingField = 'isEditing' + field.charAt(0).toUpperCase() + field.slice(1);
    (this as any)[editingField] = !(this as any)[editingField];
    if (!(this as any)[editingField]) {
      this.calculateCompletionPercentage();
    }
  }

  // Example method to add new coupons
  addNewCoupon() {
    this.courseCoupons.push({ courseFee: 0, discountFee: 0, discountPercentage: 0 });
    this.calculateCompletionPercentage(); // Recalculate percentage
  }


  courseDescriptionError: string = '';
  showRequiredError: boolean = false;
  showMinDurationError: boolean = false;
  showMaxDurationError: boolean = false;


  onFieldChange() {
    this.calculateCompletionPercentage();
    this.validateCourseDescription();
    //course furation weeks
    if (this.courseDuration === null || this.courseDuration === undefined) {
      this.showRequiredError = true;
      this.showMinDurationError = false;
      this.showMaxDurationError = false;
    } else {
      this.showRequiredError = false;
      this.showMinDurationError = this.courseDuration < 1;
      this.showMaxDurationError = this.courseDuration > 100;
    }

  }

  validateCourseDescription() {
    if (!this.courseDescription.trim()) {
      this.courseDescriptionError = "Course objective is required.";
    } else if (this.courseDescription.length < 10) {
      this.courseDescriptionError = "Course objective must be at least 10 characters.";
    } else if (this.courseDescription.length > 1500) {
      this.courseDescriptionError = "Course objective must not exceed 1500 characters.";
    } else {
      this.courseDescriptionError = ""; // No error
    }
  }

  addcourseQuiz() {
    if (this.lessonId) {
      this.router.navigate([`/mentorquiz/`, this.lessonId]);
    } else {
      alert('Please ensure Lesson ID is set.');
    }
  }

  ////////////////////add Assignments /////////////////////
  currentLessonId: number | null = null;
  addcourseAssignments12(lessonId: number, courseId: number): void {
    this.isPopupVisible = true;
    this.currentLessonId = lessonId;
  }
  addcourseAssignments() {

    this.isPopupVisible = true;

  }

  //////////////////online ////////////////

  get courses() {
    return this.courseForm.get('courses') as FormArray;
  }
  createCourseGroup(): FormGroup {
    return this.fb.group({

      courseTopic: ['', Validators.required],
      meetingStarting: ['', Validators.required]  // Add meetingStarting field

    });
  }
  addCourse() {
    this.courses.push(this.createCourseGroup());
  }
  removeCourse(index: number) {
    this.courses.removeAt(index);
  }

  onSubmitOnline() {
    console.log(this.courseForm.value);
  }
  onSubmitonlinecourse(): void {
    if (this.courseForm.valid) {
      console.log(this.courseForm.value);

      // Call the FusionService to save the online course
      this.fusionService.saveCourseOnline(this.courseForm.value).subscribe(
        {next:response => {
          console.log('Course saved successfully', response);
          alert('Course saved successfully');
        },
        error:(error) => {
          console.error('Error saving course', error);
          alert('Error saving course');
        }}
      );
    }
  }
  navigateToDashboard() {
    this.router.navigate(['/mentorperspective', ""]);
  }
  submitAll() {
    console.log('Save all data...');
    alert('All data has been submitted successfully!');
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  courseType1: 'short' | 'long' = 'short';
  modules: Module[] = [
    {
      name: 'Module 1',
      lessons: [
        {
          lessonTitle: '',
          lessonContent: '',
          lessonDescription: '',
          lessonDuration: 0,
          uploadSets: []
        }
      ]
    }
  ];

  activeModuleIndex: number = 0;

  addModule() {
    this.modules.push({
      name: '',
      lessons: [{
        lessonTitle: '',
        lessonContent: '',
        lessonDescription: '',
        lessonDuration: 0,
        uploadSets: []
      }]
    });
    this.activeModuleIndex = this.modules.length - 1;
  }
  deleteModule(moduleIndex: number) {
    const moduleToDelete = this.modules[moduleIndex];
    
    if (!moduleToDelete.moduleId) {
      // If module hasn't been saved to backend yet, just remove it from array
      this.modules.splice(moduleIndex, 1);
      this.updateActiveModuleIndex(moduleIndex);
      return;
    }

    this.fusionService.deleteModule(moduleToDelete.moduleId).subscribe({
      next: () => {
        // Remove module from array after successful deletion
        this.modules.splice(moduleIndex, 1);
        this.updateActiveModuleIndex(moduleIndex);
      },
      error: (error) => {
        console.error('Error deleting module:', error);
        // Handle error - show user feedback
        alert('Failed to delete module. Please try again.');
      }
    });
  }

  private updateActiveModuleIndex(deletedIndex: number) {
    if (this.activeModuleIndex >= this.modules.length) {
      this.activeModuleIndex = Math.max(0, this.modules.length - 1);
    } else if (this.activeModuleIndex === deletedIndex) {
      // If the deleted module was active, activate the next one or the last one
      this.activeModuleIndex = Math.min(deletedIndex, this.modules.length - 1);
    }
  }
 
  
  addNewLesson1(moduleIndex: number) {
    this.modules[moduleIndex].lessons.push({
      lessonTitle: '',
      lessonContent: '',
      lessonDescription: '',
      lessonDuration: 0,
      uploadSets: []
    });
  }

  addLesson3(moduleIndex: number) {
    this.addNewLesson1(moduleIndex);
  }

  removeModule(moduleIndex: number) {
    this.modules.splice(moduleIndex, 1);
    if (this.activeModuleIndex >= this.modules.length) {
      this.activeModuleIndex = this.modules.length - 1;
    }
  }

  removeLesson1(moduleIndex: number, lessonIndex: number) {
    this.modules[moduleIndex].lessons.splice(lessonIndex, 1);
    if (this.modules[moduleIndex].lessons.length === 0) {
      this.addLesson3(moduleIndex);
    }
  }

  setActiveModule(index: number) {
    this.activeModuleIndex = index;
  }

  toggleLessons(moduleIndex: number) {
    this.activeModuleIndex = this.activeModuleIndex === moduleIndex ? -1 : moduleIndex;
  }

  generateLessons(count: number) {
    const newLessons = Array.from({ length: count }, (_, i) => ({
      lessonTitle: `Lesson ${i + 1}`,
      lessonContent: '',
      lessonDescription: '',
      lessonDuration: 30,
      uploadSets: []
    }));
    this.modules[this.activeModuleIndex].lessons = newLessons;
  }


  onFileChange(event: any, setIndex: number, moduleIndex?: number, lessonIndex?: number): void {
    const files = event.target.files;

    if (moduleIndex !== undefined && lessonIndex !== undefined) {
      // Handle modules and lessons structure
      const uploadSet = this.modules[moduleIndex].lessons[lessonIndex].uploadSets[setIndex];
      uploadSet.videoFiles = Array.from(files);
      uploadSet.videoDescriptions = Array(files.length).fill('');
    } else {
      // Handle flat structure
      this.uploadSets[setIndex].videoFiles = Array.from(files);
      this.uploadSets[setIndex].videoDescriptions = Array(files.length).fill('');
    }
  }


  addNewUploadSet2(moduleIndex: number, lessonIndex: number): void {
    this.modules[moduleIndex].lessons[lessonIndex].uploadSets.push({ videoFiles: [], videoDescriptions: [] });
  }

  onSubmit1() {
    console.log('Course Type:', this.courseType1);
    console.log('Modules:', this.modules);
  }

  //////////////////////////////////////////////add assignment///////////////////////////////////////////////////////////
  showTermsModal: boolean = false;
  acceptedTerms: boolean = false;










  removeFile(): void {
    this.selectedFile = null;
    this.fileName = 'No file chosen';
    const fileInput = <HTMLInputElement>document.getElementById('file-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onUpload(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('assignmentTitle', this.assignmentTitle);
      formData.append('assignmentTopicName', this.assignmentTopicName);

      // Format dates
      const formattedStartDate = this.datePipe.transform(this.startDate, 'yyyy-MM-ddTHH:mm:ss');
      const formattedEndDate = this.datePipe.transform(this.endDate, 'yyyy-MM-ddTHH:mm:ss');

      formData.append('startDate', formattedStartDate || '');
      formData.append('endDate', formattedEndDate || '');

      // Append file
      formData.append('document', this.selectedFile, this.selectedFile.name);
      this.http.post(`${environment.apiBaseUrl}/saveLesson/${this.lessonId}/${this.courseId}`, formData).subscribe(



        {next:response => {
          console.log('Assignment saved successfully:', response);
          this.snackBar.open('Assignment saved successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        },
        error:(error) => {
          console.error('Error saving assignment:', error);
        }}
      );
    } else {
      console.error('No file selected');
    }
  }
  termsContent: string[] = [
    "Welcome to our course management system.",
    "By accessing and using this system, you agree to the following terms and conditions.",
    "You must ensure that all the information you provide is accurate and up-to-date.",
    "You are responsible for maintaining the confidentiality of your account and password.",
    "You must not use this system for any unlawful purpose.",
    "We reserve the right to suspend or terminate your access to the system if you violate these terms.",
    "We do not guarantee the availability of the system at all times.",
    "We may update these terms and conditions from time to time without notice.",
    "Your continued use of the system after any changes constitutes your acceptance of the new terms.",
    "If you have any questions about these terms and conditions, please contact our support team."
  ];

  closeModal() {
    this.showTermsModal = false;
  }

  acceptTerms() {
    this.showTermsModal = false;
  }

  enableDropdown() {
  }

  saveModule(moduleIndex: number): void {
    const module = this.modules[moduleIndex];
    // Add your save logic here, e.g., make an API call to save the module
    console.log('Module saved:', module);
  }
  //////////////////////////Module
  isFormValid(): boolean {
    return this.modules.every(module => module.name.trim() !== '');
  }
  onSubmitModule(moduleIndex: number): void {
    if (this.isFormValid()) {
      const lessonModule = {
        moduleName: this.modules[moduleIndex].name, // Use the module name from the correct index
      };

      this.fusionService.createLessonModule(lessonModule, this.courseId)
        .subscribe(
          {next:response => {
            console.log('Lesson module created successfully', response);
            this.moduleId = response.id
            console.log(this.moduleId + "hiiiiii how are")
            this.alertMessage = 'Lesson module created successfully';
            this.alertType = 'success';
            // Handle success (e.g., show a success message, reset form)
          },
          error:(error) => {
            console.error('Error creating lesson module', error);
            this.alertMessage = 'Error creating lesson module';
            this.alertType = 'error';
            // Handle error (e.g., show an error message)
          }}
        );
    }
  }

  // lessonModuleId:any=36;
  onSubmitLesson(moduleIndex: number, lessonIndex: number): void {
    const lesson = this.modules[moduleIndex].lessons[lessonIndex];
    const lessonModuleId = 39;

    // Exclude uploadSets from the lesson data sent to the backend
    const lessonToSend = {
      lessonTitle: lesson.lessonTitle.trim(),
      lessonContent: lesson.lessonContent?.trim() || '',
      lessonDescription: lesson.lessonDescription?.trim() || '',
      lessonDuration: lesson.lessonDuration || 0
    };

    this.fusionService.createModuleLesson(lessonToSend, lessonModuleId)
      .subscribe(
        {next:response => {
          console.log('Lesson created successfully', response);
          this.lessonId = response.id;
          this.alertMessage = 'Lesson created successfully';
          this.alertType = 'success';
        },
        error:(error) => {
          console.error('Error creating lesson', error);
          this.alertMessage = 'Error creating lesson';
          this.alertType = 'error';
        }}
      );
  }

  generateLesson2(moduleIndex: number, lessonIndex: number): void {
    const lesson: Lesson3 = {
      lessonTitle: this.modules[moduleIndex].lessons[lessonIndex].lessonTitle,
      lessonContent: this.modules[moduleIndex].lessons[lessonIndex].lessonContent,
      lessonDescription: this.modules[moduleIndex].lessons[lessonIndex].lessonDescription,
      lessonDuration: this.modules[moduleIndex].lessons[lessonIndex].lessonDuration
    };

    // const predefinedModuleId = 36; // Use a predefined module ID for testing

    this.fusionService.createModuleLesson(lesson, this.moduleId,).subscribe(
      {next:response => {
        this.alertMessage = 'Lesson created successfully!';
        this.lessonId = response.id

        console.log(this.lessonId, 'this was the lesson ID')
        this.alertType = 'success';
      },
      error:(error) => {
        this.alertMessage = 'Failed to create lesson.';
        this.alertType = 'error';
      }}
    );
  }

  // Predefined course and lesson IDs

  onSubmitLessonVideo2(moduleIndex: number, lessonIndex: number, lessonId: any): void {
    const lesson = this.modules[moduleIndex].lessons[lessonIndex];
 
    // Ensure courseId is properly assigned from a valid source
    if (!this.courseId) {
      console.error("Course ID is undefined! Please set it before submission.");
      alert("Error: Course ID is missing. Please try again.");
      return;
    }
 
    // Handle lessonId assignment
    if (!lesson.isVideosFetched) {
      this.lessonId = lessonId; // Fresh upload case
      console.log(`Fresh upload - courseId: ${this.courseId}, lessonId: ${this.lessonId}`);
    } else {
      this.lessonId = lesson.lessonId || lessonId; // Reuse existing lessonId if available
      console.log(`Reusing lessonId for additional upload: ${this.lessonId}`);
    }
 
    // Ensure lessonId is properly set
    if (!this.lessonId) {
      alert("Please ensure Lesson ID is set.");
      return;
    }
 
    // Check if all video descriptions are filled
    const allDescriptionsFilled = lesson.uploadSets.every((set: UploadSet) =>
      set.videoDescriptions.every((desc: string) => desc.trim() !== "")
    );
 
    if (!allDescriptionsFilled) {
      alert("Please add descriptions for all videos.");
      return;
    }
 
    // Prepare form data for upload
    const formData = new FormData();
    lesson.uploadSets.forEach((set: UploadSet) => {
      set.videoFiles.forEach((file: File, fileIndex: number) => {
        formData.append("file", file, file.name);
        formData.append("description", set.videoDescriptions[fileIndex]);
      });
    });
    formData.append("courseId", this.courseId.toString());
    formData.append("lessonId", this.lessonId.toString());
 
    // Debugging: Log formData contents
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
 
    // Perform upload
    this.fusionService.uploadVideos(formData, this.courseId, this.lessonId).subscribe(
      {next:(response) => {
        console.log("Upload successful:", response);
        this.resetForm();
        alert("Upload successful!");
 
        // Fetch updated videos
        this.getVideosByLessonIdlong(this.lessonId, moduleIndex, lessonIndex);
 
        // Mark videos as fetched and store lessonId for future uploads
        lesson.isVideosFetched = true;
        lesson.lessonId = this.lessonId;
      },
      error:(error) => {
        console.error("Upload failed!", error);
        alert("Upload failed. Please try again.");
      }}
    );
  }
 
 
 


  //////////////////// get long lesson videos

  getVideosByLessonIdlong(lessonId: number, moduleIndex: number, lessonIndex: number): void {
    if (!lessonId || moduleIndex === undefined || lessonIndex === undefined) {
      console.error('Invalid parameters:', { lessonId, moduleIndex, lessonIndex });
      return;
    }

    console.log('Fetching videos for lesson ID:', lessonId);

    this.fusionService.getVideosByLessonId(lessonId).subscribe(
      {next:(videos: Video234[]) => {
        if (videos && videos.length > 0) {
          if (this.modules[moduleIndex] && this.modules[moduleIndex].lessons[lessonIndex]) {
            // Store the fetched videos in the lesson object
            this.modules[moduleIndex].lessons[lessonIndex].videos = videos;
            this.modules[moduleIndex].lessons[lessonIndex].isVideosFetched = true; // Mark videos fetched
            this.modules[moduleIndex].lessons[lessonIndex].lessonId = lessonId; // Store lessonId here
            console.log(`Fetched videos for lesson ${lessonId}:`, videos);
          } else {
            console.error('Invalid module or lesson index:', { moduleIndex, lessonIndex });
          }
        } else {
          console.warn(`No videos found for lesson ${lessonId}`);
        }
      },
      error:(error: any) => {
        console.error('Error fetching videos for lesson ' + lessonId, error);
      }}
    );
  }


  setCourseAndLesson(courseId: number, lessonId: number): void {
    this.courseId = courseId;
    this.lessonId = lessonId;
  }




  /////////////////////add quiz//////////////////////
  toggleOverlay() {
    this.showOverlay = !this.showOverlay;
  }

  addMCQ() {
    this.questions.push({
      text: '',
      type: 'mcq',
      options: [
        { label: 'A', text: '' },
        { label: 'B', text: '' },
        { label: 'C', text: '' },
        { label: 'D', text: '' }
      ],
      correctAnswer: ''
    });
  }

  addTrueFalse() {
    this.questions.push({
      text: '',
      type: 'truefalse',
      correctAnswer: ''
    });
  }

  createQuiz() {
    this.showQuiz = true;
  }

  resetQuestions() {
    this.questions = [];
    this.questionCount = 0;
  }

  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
    this.questionCount--;
  }

  quizId: any;

  onSaveQuiz() {
    // Validate quiz name
    if (!this.quizName) {
      alert('Please enter a quiz name.');
      return;
    }

    // Validate dates
    const now = new Date();
    if (!this.startDate || new Date(this.startDate) < now) {
      alert('Start date must be the current or a future date.');
      return;
    }
    if (!this.endDate) {
      alert('Please enter an end date.');
      return;
    }
    if (new Date(this.endDate) <= new Date(this.startDate)) {
      alert('End date must be later than the start date.');
      return;
    }

    // Construct quiz object
    const quiz: Quiz = {
      quizName: this.quizName,
      startDate: this.startDate,
      endDate: this.endDate,
    };

    if (!this.lessonId) {
      console.error('lessonId is not set');
      alert('Unable to create quiz. Lesson ID is not set.');
      return;
    }

    // Create quiz
    this.fusionService.createLessonQuiz(quiz, this.lessonId).subscribe(
      {next:(response) => {
        console.log('Quiz created successfully:', response);
        this.quizId = response.id;
        alert('Quiz created successfully!');
        this.isQuizCreated = true;
        this.quizName = '';
        this.startDate = '';
        this.endDate = '';
      },
      error:(error) => {
        console.error('Unable to create quiz', error);
        alert('Unable to create quiz. Please try again.');
      }}
    );
  }

  currentDate: string = new Date().toISOString().slice(0, 16); // Initialize current date
  onStartDateChange() {
    const start = new Date(this.startDate);
    if (this.endDate && new Date(this.endDate) <= start) {
      this.endDate = ''; // Clear end date if it's invalid
    }
  }
  onSaveQuiz11() {
    if (!this.quizName) {
      alert('Please enter a quiz name.');
      return;
    }

    if (!this.startDate || !this.endDate) {
      alert('Please enter both start and end dates.');
      return;
    }

    const currentDate = new Date();
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    // Check if start date is in the past
    if (start < currentDate) {
      alert('Start date must be the current or a future date.');
      return;
    }

    // Check if end date is earlier than start date
    if (end <= start) {
      alert('End date must be later than the start date.');
      return;
    }

    const quiz: Quiz = {
      quizName: this.quizName,
      startDate: this.startDate,
      endDate: this.endDate
    };

    if (!this.lessonId) {
      console.error('lessonId is not set');
      alert('Unable to create quiz. Lesson ID is not set.');
      return;
    }

    console.log(`lessonId before submission: ${this.lessonId}`);
    this.fusionService.createLessonQuiz(quiz, this.lessonId).subscribe(
      {next:(response) => {
        console.log('Quiz created successfully:', response);
        this.quizId = response.id;
        alert('Quiz created successfully!');
        this.isQuizCreated = true; // Enable questions section
        this.quizName = '';
        this.startDate = '';
        this.endDate = '';
      },
      error:(error) => {
        console.error('Unable to create quiz', error);
        alert('Unable to create quiz. Please try again.');
      }}
    );
  }

  onSaveQuiz2() {
    if (!this.quizName) {
      alert('Please enter a quiz name.');
      return;
    }
    if (!this.startDate || !this.endDate) {
      alert('Please enter both start and end dates.');
      return;
    }
    if (new Date(this.endDate) <= new Date(this.startDate)) {
      alert('End date must be later than start date.');
      return;
    }
    const quiz: Quiz = {
      quizName: this.quizName,
      startDate: this.startDate,
      endDate: this.endDate
    };
    this.lessonId = this.lessonid;

    if (!this.lessonId) {
      console.error('lessonId is not set');
      alert('Unable to create quiz. Lesson ID is not set.');
      return;
    }


    console.log(`lessonId before submission: ${this.lessonId}`);
    this.fusionService.createLessonQuiz(quiz, this.lessonId).subscribe(
      {next:(response) => {
        console.log('Quiz created successfully:', response);
        this.quizId = response.id;
        console.log(this.quizId);
        alert('Quiz created successfully!');
        this.isQuizCreated = true; // Enable questions section
        this.quizName = '';
        this.startDate = '';
        this.endDate = '';
      },
      error:(error) => {
        console.error('Unable to create quiz', error);
        alert('Unable to create quiz. Please try again.');
      }}
    );
  }

  isQuizFormValid(): boolean {
    for (const question of this.questions) {
      if (!question.text) return false;
  
      for (const option of question.options) {
        if (!option.text) return false;
      }
  
      if (!question.correctAnswer) return false;
    }
    return true;
  }
  

  submitQuiz() {
    // Check if all questions are filled
    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i];

      if (!question.text) {
        alert(`Please enter text for Question ${i + 1}`);
        return;
      }

      // Check if all options are filled
      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].text) {
          alert(`Please enter text for Option ${j + 1} in Question ${i + 1}`);
          return;
        }
      }

      // Ensure correct answer is selected
      if (!question.correctAnswer) {
        alert(`Please select a correct answer for Question ${i + 1}`);
        return;
      }
    }

    const quizId = this.quizId; // Replace with the actual quiz ID
    this.fusionService.addQuestionsToQuiz(quizId, this.questions).subscribe(
      {next:(response) => {
        console.log('Quiz submitted successfully', response);
        alert('Quiz questions posted successfully!');
      },
      error:(error) => {
        console.error('Error submitting quiz', error);
        alert('Unable to post the Questions. Please try again.');
      }}
    );
  }

  ///////////////////////////////////////////////////
  ///////////// course resourse ///////////////////

  onFileSelectedResourse(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }


  onSubmitResourse(): void {
    if (this.selectedFile) {
      this.fusionService.uploadCourseDocument(this.courseId, this.selectedFile).subscribe(

        {next:(response) => {
          console.log('Document uploaded successfully', response);
          alert('Document uploaded successfully!');
        },
        error:(error) => {
          console.error('Error uploading document', error);
          alert('Error uploading document!');
        }}
      );
    } else {
      console.error('No file selected');
      alert('No file selected');
    }
  }
  ////////////// course video/////////////
  onVideoUpload2(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedVideo = input.files[0];
      console.log('Video file selected:', this.selectedVideo.name);
    } else {
      this.selectedVideo = null;
      console.log('No video selected');
    }
  }
  selectedVideo: File | null = null;

  saveVideo2(): void {
    if (this.selectedVideo && this.courseId) {
      // Debug logs to ensure courseId and selectedVideo are set
      console.log('Course ID:', this.courseId);
      console.log('Selected video:', this.selectedVideo.name);

      this.mentor1service.uploadVideo(this.courseId, this.selectedVideo).subscribe({
        next: (response) => {
          console.log('Upload successful:', response);
          alert('Video uploaded successfully!');
          this.selectedVideo = null; // Clear the selected video after saving
        },
        error: (error) => {
          console.error('Upload failed:', error);
          alert('Video upload failed.');
        }
      });
    } else {
      if (this.courseId === null) {
        console.error('Course ID is not set');
      }
      if (this.selectedVideo === null) {
        console.error('No video selected');
      }
      alert('Please select a video and ensure course ID is set before saving.');
    }
  }
  //////////////////////// ASSIGNMENT ////////////////////////////



  openModal() {
    if (!this.acceptedTerms) {
      this.showTermsModal = true;
    }
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }

  validateDates(formGroup: AbstractControl): { [key: string]: boolean } | null {
    const startDate = new Date(formGroup.get('startDate')?.value);
    const endDate = new Date(formGroup.get('endDate')?.value);
    const reviewMeetDate = new Date(formGroup.get('reviewMeetDate')?.value);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || isNaN(reviewMeetDate.getTime())) {
      return null; // Skip validation if any date is missing
    }

    if (endDate < startDate) {
      return { endDateBeforeStartDate: true };
    }

    if (reviewMeetDate < startDate || reviewMeetDate < endDate) {
      return { reviewMeetDateInvalid: true };
    }

    return null; // Valid dates
  }
  get startDateError() {
    return this.assignmentForm.errors?.['endDateBeforeStartDate'];
  }

  get reviewDateError() {
    return this.assignmentForm.errors?.['reviewMeetDateInvalid'];
  }


  reviewMeetDateAfterStartDateValidator(group: FormGroup): { [key: string]: boolean } | null {
    const startDate = group.get('startDate')?.value;
    const reviewMeetDate = group.get('reviewMeetDate')?.value;

    if (startDate && reviewMeetDate && new Date(reviewMeetDate) < new Date(startDate)) {
      return { reviewMeetDateInvalid: true };
    }
    return null;
  }
 






  ///////////////////////////// VALIDATIONS COURSELANDING /////////////////////////////////////


  isFormValid2(): boolean {
    console.log('Validating form');
    return !!this.level &&
      !!this.courseType &&
      !!this.courseDescription &&
      !!this.courseDuration &&
      !!this.courseLanguage &&
      this.whyEnrolls.length >= 5 &&
      (this.courseType !== 'offline' || !!this.courseTerm) &&
      !!this.courseImage;
  }

  get showCourseTitleError(): boolean {
    return this.formSubmitted && !this.courseTitle;
  }

  get showLevelError(): boolean {
    return this.formSubmitted && !this.level;
  }

  get showCourseTypeError(): boolean {
    return this.formSubmitted && !this.courseType;
  }

  get showCourseTermError(): boolean {
    return this.formSubmitted && this.courseType === 'offline' && !this.courseTerm;
  }

  get showCourseDescriptionError(): boolean {
    return this.formSubmitted && !this.courseDescription;
  }

  get showWhyEnrollError(): boolean {
    return this.formSubmitted && this.whyEnrolls.length < 5;
  }

  get showCourseDurationError(): boolean {
    return this.formSubmitted && !this.courseDuration;
  }

  get showLanguageError(): boolean {
    return this.formSubmitted && !this.courseLanguage;
  }
  get showCourseImageError(): boolean {
    return this.formSubmitted && !this.courseImage;
  }


  ///////////////////////////// VALIDATIONS COURSE PLANNING /////////////////////////////////////
  prerequisites: string[] = [''];
  prerequisitesForm: FormGroup;
  tools: { name: string, image: SafeUrl | null, file: File | null }[] = [];
  skills: { name: string, image: SafeUrl | null, file: File | null }[] = [];

  addTool() {
    this.tools.push({ name: '', image: null, file: null });
  }

  addSkill() {
    this.skills.push({ name: '', image: null, file: null });
  }
  addPrerequisite() {
    if (this.prerequisites.length < 8) {
      this.prerequisites.push('');
    }
  }
  // Remove Tool
  removeTool(index: number) {
    this.tools.splice(index, 1);
  }

  // Remove Skill
  removeSkill(index: number) {
    this.skills.splice(index, 1);
  }
  // Remove Prerequisite
  removePrerequisite(index: number) {
    this.prerequisites.splice(index, 1);
  }
  onPrerequisiteChange(event: any, index: number) {
    this.prerequisites[index] = event.target.value;
  }

  updatePrerequisite(event: any, index: number) {
    const value = event.target.value;
    this.prerequisites[index] = value;
  }

  isFormValid1(): boolean {
    const isToolValid = this.tools.some(tool => tool.name && tool.image);
    const isSkillValid = this.skills.some(skill => skill.name && skill.image);
    const isPrerequisiteValid = this.prerequisites.some(prereq => prereq.trim() !== '');
    return isToolValid && isSkillValid && isPrerequisiteValid;
  }
  get showPrerequisiteError(): boolean {
    return this.formSubmitted && !this.prerequisites.some(prereq => prereq.trim() !== '');
  }
  get showToolError(): boolean {
    return this.formSubmitted && !this.tools.some(tool => tool.name && tool.image);
  }

  get showSkillError(): boolean {
    return this.formSubmitted && !this.skills.some(skill => skill.name && skill.image);
  }


  onSubmit() {
    this.formSubmitted = true;
  
    if (!this.isFormValid1()) {
      alert('Please fill all required fields correctly.');
      return;
    }
  
    const formData = new FormData();
    let hasValidData = false;
  
    // Handle Tools
    if (this.tools.length > 0) {
      this.tools.forEach((tool, index) => {
        if (tool.name && tool.file) {
          formData.append('toolNames', tool.name);
          formData.append('toolImages', tool.file);
          hasValidData = true;
        }
      });
    }
    
    // If no valid tools, add a dummy tool to satisfy the requirement
    if (!hasValidData) {
      formData.append('toolNames', '');
      // Create an empty Blob to satisfy the toolImages requirement
      const emptyBlob = new Blob([''], { type: 'image/png' });
      formData.append('toolImages', emptyBlob, 'dummy.png');
    }
  
    // Handle Skills
    this.skills.forEach((skill, index) => {
      if (skill.name && skill.file) {
        formData.append('skillNames', skill.name);
        formData.append('skillImages', skill.file);
      }
    });
  
    // Handle Prerequisites
    this.prerequisites
      .filter(prereq => prereq.trim() !== '')
      .forEach(prereq => {
        formData.append('coursePrerequisitesList', prereq.trim());
      });
  
    // Log the form data for debugging
    formData.forEach((value, key) => {
      console.log('Form Data:', key, value);
    });
  
    // Make the API call
    this.http.post(
      `${environment.apiBaseUrl}/courseTools/saveMultipleCourseTools/${this.courseId}`,
      formData
    ).subscribe({
      next: (response: any) => {
        console.log('Success:', response);
        alert('Tools and skills saved successfully!');
        this.updatePercentage();
        this.setCurrentTab('lesson');
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Failed to save tools and skills. Please ensure all required fields are filled.');
      }
    });
  }
 

  // Handle file selection for both tools and skills
  onFileSelected1(event: any, type: 'tool' | 'skill', index: number) {
    const file = event.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed!');
        event.target.value = ''; // Reset the file input field
        return;
      }

      const fileUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));

      if (type === 'tool') {
        this.tools[index].image = fileUrl;
        this.tools[index].file = file;
      } else if (type === 'skill') {
        this.skills[index].image = fileUrl;
        this.skills[index].file = file;
      }
    }
  }
 
    // Modified getCourseToolsData method
    getCourseToolsData(): void {
      this.http.get(`${environment.apiBaseUrl}/courseTools/course/${this.courseId}`).subscribe(
        {next:(response: any) => {
          if (response && response.length > 0) {
            this.tools = [];
            this.skills = [];
            this.prerequisites = [];
  
            response.forEach((item: any) => {
              if (item.toolName) {
                this.tools.push({
                  name: item.toolName,
                  image: item.toolImage ? this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${item.toolImage}`) : null,
                  file: null
                });
              }
  
              if (item.skillName) {
                this.skills.push({
                  name: item.skillName,
                  image: item.skillImage ? this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${item.skillImage}`) : null,
                  file: null
                });
              }
  
              if (item.coursePrerequisites) {
                this.prerequisites.push(item.coursePrerequisites);
              }
            });
          }
          
          // Initialize with empty entries if no data
          if (this.tools.length === 0) this.addTool();
          if (this.skills.length === 0) this.addSkill();
          if (this.prerequisites.length === 0) this.prerequisites = [''];
        },
        error:(error) => {
          console.error('Failed to fetch course tools data.', error);
          alert('Failed to fetch course tools data.');
          
          // Initialize with empty entries in case of error
          this.addTool();
          this.addSkill();
          this.prerequisites = [''];
        }}
      );
    }
  

  ///////////////////// COURSE TRAILER /////////////////////////// 
  videoTrailers: { file: File | null, videoTrailerTitle: string, description: string }[] = [
    { file: null, videoTrailerTitle: ' ', description: 'Beginner' }, // Mandatory fields
    { file: null, videoTrailerTitle: ' ', description: 'Intermediate' }, // Optional
    { file: null, videoTrailerTitle: ' ', description: 'Advanced' } // Optional
  ];





  uploadResponses: string[] = [];

  onFilevideoTrailersSelected(event: Event, index: number) {

    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {

      const file = fileInput.files[0];

      // Ensure it's a video file

      if (!file.type.startsWith('video/')) {

        alert('Please select a valid video file.');

        fileInput.value = ''; // Reset file input

        return;

      }

      const video = document.createElement('video');

      video.preload = 'metadata';

      video.onloadedmetadata = () => {

        window.URL.revokeObjectURL(video.src);

        const duration = video.duration; // Video duration in seconds

        console.log('Video Duration:', duration);

        if (duration > 180) {

          alert('Video must be 3 minutes or less.');

          fileInput.value = ''; // Reset file input

          return;

        }

        // Assign valid file to the array

        this.videoTrailers[index].file = file;

        console.log('Updated trailer:', this.videoTrailers[index]);

      };

      video.src = URL.createObjectURL(file);

    }

  }





  uploadTrailers() {
    console.log('Video trailers array:', this.videoTrailers); // Log the entire array to verify values

    const firstTrailer = this.videoTrailers[0];
    if (!firstTrailer.file || !firstTrailer.videoTrailerTitle || !firstTrailer.description) {
      console.log('First trailer fields:', firstTrailer); // Log the first trailer's fields
      alert('The first video trailer is mandatory. Please fill in all required fields.');
      return;
    }

    // Reset the responses
    this.uploadResponses = [];

    // Track the number of successful uploads
    let successCount = 0;

    // Iterate over videoTrailers and upload each if it has a file
    this.videoTrailers.forEach((trailer, index) => {
      if (trailer.file && trailer.videoTrailerTitle && trailer.description) {
        this.fusionService.uploadVideoTrailer(this.courseId, trailer.file, trailer.videoTrailerTitle, trailer.description)
          .subscribe({
            next: (response) => {
              this.uploadResponses[index] = `Success: ${response.message}`;
              successCount++;

              // If all uploads are done, show a success alert
              if (successCount === this.videoTrailers.filter(t => t.file).length) {
                alert('All videos have been successfully uploaded!');
              }
            },
            error: (error) => {
              this.uploadResponses[index] = `Error: ${error.message}`;
            }
          });
      }
    });
  }



  videoTrailerss: CourseVideoTrailer[] = []; // Correct type here

  fetchVideoTrailers(courseId: number): void {
    this.fusionService.getVideoTrailersByCourseId(courseId).subscribe({
      next: (response: CourseVideoTrailer[]) => { // Ensure correct type is used
        this.videoTrailerss = response;
      },
      error: (error) => {
        console.error('Error fetching video trailers:', error);
      }
    });
  }


  deleteVideoTrailer(id: number): void {
    if (confirm('Are you sure you want to delete this video trailer?')) {
      this.fusionService.deleteVideoTrailerById(id).subscribe({
        next: () => {
          // Remove the trailer from the list
          this.videoTrailerss = this.videoTrailerss.filter(trailer => trailer.id !== id);
          alert('Video trailer deleted successfully.');
        },
        error: (error) => {
          console.error('Error deleting video trailer:', error);
          alert('Error deleting video trailer.');
        }
      });
    }
  }
  //////////// fetch course 
  level_1: any;
  level_2: any;
  level_3: any;
  level_4: any;
  level_5: any;
  level_6: any;
  level_7: any;
  level_8: any;
  fetchCourseData(): void {
    this.fusionService.getCourseById(this.courseId).subscribe(
      {next:(response: any) => {
        console.log('Course data fetched:', response);

        this.courseTitle = response.courseTitle;
        this.level = response.level;
        this.courseDescription = response.courseDescription;
        this.courseLanguage = response.courseLanguage;
        this.courseDuration = response.courseDuration;
        this.courseType = response.courseType;
        this.courseTerm = response.courseTerm;

        this.level_1 = response.level_1;
        this.level_2 = response.level_2;
        this.level_3 = response.level_3;
        this.level_4 = response.level_4;
        this.level_5 = response.level_5;
        this.level_6 = response.level_6;
        this.level_7 = response.level_7;
        this.level_8 = response.level_8;
        this.level_2 = response.level_2;
        this.level_2 = response.level_2;
        this.level_2 = response.level_2;



        if (response.courseImage) {
          this.courseImage = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${response.courseImage}`);
        }




        this.onFieldChange();
      },
      error:(error: any) => {
        console.error('Error fetching course data:', error);
      }}
    );
  }

  /////////////////////////////////////
  onSubmit23(lessonId: number): void {
    if (this.assignmentForm.valid && this.selectedFile) {
      const formValues = this.assignmentForm.value;
      const startDate = new Date(formValues.startDate).toISOString().slice(0, 19);
      const endDate = new Date(formValues.endDate).toISOString().slice(0, 19);
      const reviewMeetDate = new Date(formValues.reviewMeetDate).toISOString().slice(0, 19);

      this.fusionService.uploadAssignment3(
        lessonId,
        this.courseId,
        formValues.assignmentTitle,
        formValues.assignmentTopicName,
        this.selectedFile,
        startDate,
        endDate,
        reviewMeetDate
      ).subscribe(
        {next:response => {
          console.log('Upload successful', response);
          this.closePopup();
        },
        error:(error) => {
          console.error('Upload failed', error);
        }}
      );
    } else {
      alert('Please fill in all fields and select a file.');
    }
  }
  // Fetch assignments by lessonId
  // Method to get assignments for a specific lesson
  assignments: Assignment[] = [];  // Store assignments here

  
  
  //////////// getting long course ///////////////

  selectedModuleId: number | null = null;

  fetchModules() {
    if (this.courseId) {
      this.fusionService.getLessonModulesByCourseId(this.courseId).subscribe(
        {next:(response: any) => {
          this.modules = response.map((moduleData: any) => ({
            moduleId: moduleData.id,
            name: moduleData.moduleName,
            lessons: []
          }));
          console.log('Modules fetched successfully', this.modules);

          if (this.modules.length > 0 && this.modules[0].moduleId) {
            this.fetchLessonsByModuleId(this.modules[0].moduleId);
          }
        },
        error:(error) => {
          console.error('Error fetching modules', error);
        }}
      );
    }
  }

  fetchLessonsByModuleId(moduleId: number) {
    if (moduleId !== null) {
      this.selectedModuleId = moduleId;

      console.log('Fetching lessons for module:', moduleId);

      this.fusionService.getLessonsByModuleId(moduleId).subscribe(
        {next:(lessons: any[]) => {
          const moduleIndex = this.modules.findIndex(module => module.moduleId === moduleId);

          if (moduleIndex !== -1) {
            this.modules[moduleIndex].lessons = lessons.map((lesson: any, lessonIndex: number) => {
              const mappedLesson = {
                lessonId: lesson.id,
                lessonTitle: lesson.lessonTitle,
                lessonContent: lesson.lessonContent,
                lessonDescription: lesson.lessonDescription,
                lessonDuration: lesson.lessonDuration,
                uploadSets: lesson.uploadSets || [],
                videos: lesson.videos || []
              };

              // Fetch videos for each lesson
              this.getVideosByLessonIdlong(lesson.id, moduleIndex, lessonIndex);

              return mappedLesson;
            });

            console.log(`Lessons fetched successfully for module ${moduleId}`, this.modules[moduleIndex].lessons);
          } else {
            console.error(`Module with id ${moduleId} not found in this.modules array.`);
          }
        },
        error:(error) => {
          console.error(`Error fetching lessons for module ${moduleId}`, error);
        }}
      );
    } else {
      console.error('Invalid moduleId: null');
    }
  }



  // Fetch videos by lesson ID
  // Modify the getVideosLongByLessonId function to match the UploadSet structure
  async getVideosLongByLessonId(lessonId: number, moduleIndex: number) {
    this.fusionService.getVideosLongByLessonId(lessonId).subscribe(
      {next:async (videos: Video234[]) => {
        const lessonIndex = this.modules[moduleIndex].lessons.findIndex(lesson => this.lesson.lessonId === lessonId);
        if (lessonIndex !== -1) {
          // Convert URLs to File objects
          const uploadSets = await Promise.all(videos.map(async (video) => ({
            videoFiles: [await urlToFile(video.s3Url, video.videoTitle, 'video/mp4')],
            videoDescriptions: [`Description for ${video.videoTitle}`]
          })));

          this.modules[moduleIndex].lessons[lessonIndex].uploadSets = uploadSets;
        }
        console.log(`Videos fetched successfully for lesson ${lessonId}`, videos);
      },
      error:(error) => {
        console.error(`Error fetching videos for lesson ${lessonId}`, error);
      }}
    );
  }



  fetchVideos1(lessonId: number): void {
    console.log(`Fetching videos for lessonId: ${lessonId}`); // Debug log
    this.fusionService.getVideosByLessonId(lessonId).subscribe(
      {next:(response: Video234[]) => {
        console.log('Fetched videos successfully:', response);
        this.videos = response;
      },
      error:(error) => {
        console.error('Error fetching videos:', error);
      }}
    );
  }
  // Method to fetch videos by lessonId
  getVideosByLessonIdforlongcourse(lessonId: number): void {
    this.fusionService.getVideosByLessonId(lessonId).subscribe(
      {next:(videos: Video234[]) => {
        this.videos = videos;
        console.log('Fetched videos:', videos);
      },
      error:(error: any) => {
        console.error('Error fetching videos:', error);
      }}
    );
  }
  ///////////// post course resourse document //////

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;

  selectedFiles: File[] = [];


  // Trigger file input click to open file dialog
  triggerResourseFileInput(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }
  onResourseFileChange(event: any): void {
    const files: File[] = Array.from(event.target.files);
    this.selectedFiles.push(...files); // Append the new files to the selectedFiles array
  }

  removeResourseFile(index: number): void {
    this.selectedFiles.splice(index, 1); // Remove file by index
  }


  uploadResourseDocuments(): void {
    if (this.selectedFiles.length > 0) {
      this.fusionService.uploadResourseDocuments(this.courseId, this.selectedFiles).subscribe(
        {next:(response) => {
          console.log('Documents uploaded successfully', response);
          alert('Documents uploaded successfully!');
        },
        error:(error) => {
          console.error('Error uploading documents', error);
        }}
      );
    } else {
      alert('Please select files to upload.');
    }
  }

  ///////////// getting course resourse document //////
  documents: CourseDocuments[] = [];


  loadDocuments(): void {
    this.fusionService.getDocumentsByCourseId(this.courseId).subscribe(
      {next:(response) => {
        this.documents = response;
      },
      error:(error) => {
        console.error('Error fetching documents', error);
      }}
    );
  }
  downloadCourseDocument(documentData: string): void {
    // Convert the base64 document data into a binary format
    const binaryData = atob(documentData);

    // Convert the binary data into an array of bytes
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    // Create a Blob from the byte array and set the type to the correct document type
    const blob = new Blob([bytes], { type: 'application/pdf' });

    // Create a temporary download link and simulate a click
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.pdf'; // You can adjust this file name dynamically if needed
    a.click();

    // Clean up the URL object after download
    window.URL.revokeObjectURL(url);
  }
  ///////////// delete course resourse document //////
  deleteDocument(documentId: number): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.fusionService.deleteDocumentById(documentId).subscribe(
        {next:() => {
          // Remove the document from the array after successful deletion
          this.documents = this.documents.filter(doc => doc.id !== documentId);
          console.log(`Document with ID ${documentId} deleted successfully.`);
        },
        error:(error) => {
          console.error('Error deleting document', error);
        }}
      );
    }
  }
  // ================================== update course persentage ============================================
  coursePercentage: any;

  // Function to update course percentage
  updatePercentage() {
    this.fusionService.updateCoursePercentage(this.courseId, this.completionPercentage)
      .subscribe(
        {next:response => {
          console.log('Course percentage updated successfully:', response);
          alert('Course percentage updated successfully!');
        },
        error:(error) => {
          console.error('Error updating course percentage:', error);
        }}
      );
  }


  //////////////////// Instructions //////////////////





  isOverlayVisible = false;

  istoggleOverlay() {
    this.isOverlayVisible = !this.isOverlayVisible;
  }

  onOk() {
    // Handle OK action here
    this.isOverlayVisible = false;
    console.log('OK clicked');
  }

  onCancel() {
    // Handle Cancel action here
    this.isOverlayVisible = false;
    console.log('Cancel clicked');
  }
  //////////////////////////// Celebrations /////////////////////////////
  showCelebration = false;
  flowers: Flower[] = [];
  celebrationItems: CelebrationItem[] = [];

  triggerCelebration() {
    this.showCelebration = true;
    setTimeout(() => {
      this.showCelebration = false;
    }, 6000); // Celebration lasts for 6 seconds
  }
  generateCelebrationItems() {
    const types = ['flower', 'star', 'circle', 'heart', 'triangle', 'diamond', 'hexagon', 'spiral', 'moon', 'moon', 'moon', 'moon', 'lightning'];
    const colors = ['#ff9999', '#ffcc99', '#99ff99', '#99ccff', '#cc99ff', '#ff6666', '#ff9966', '#66ff66', '#6699ff', '#9966ff'];

    for (let i = 0; i < 100; i++) {
      this.celebrationItems.push({
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        left: `${Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 2}s`, // Between 2-4 seconds
        animationDelay: `${Math.random() * 2}s`, // Delay up to 2 seconds
        size: 15 + Math.random() * 20, // Size between 10-30
        strokeWidth: (Math.random() * 2 + 1).toFixed(1) // Stroke width between 1 and 3
      });
    }
  }


  getCoordinate(index: number, total: number, type: 'sin' | 'cos'): number {
    const angle = (index / total) * 2 * Math.PI;
    return type === 'sin' ? Math.sin(angle) : Math.cos(angle);
  }

  expirationDateWarning: boolean = false;

  onExpirationDateChange(event: any): void {
    const selectedDate = new Date(event.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the start of the day for accurate comparison

    if (selectedDate < today) {
      this.expirationDateWarning = true;
    } else {
      this.expirationDateWarning = false;
    }
  }

  fileErrorMessage = ''; // Error message storage

  onFileCourseDocumentSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const allowedExtensions = ['pdf', 'doc', 'docx', 'txt'];
      const files = Array.from(fileInput.files);
      for (const file of files) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
          this.fileErrorMessage = 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.';
          fileInput.value = '';
          return;
        }
      }
      this.fileErrorMessage = '';
      this.selectedFiles = files;
      console.log('Selected Documents:', this.selectedFiles);
    }
  }

  uploadFiles(): void {
    if (this.selectedFiles.length > 0) {
      this.fusionService.uploadCourseDocuments(this.courseId, this.selectedFiles)
        .subscribe({next:response => {
          console.log('Files uploaded successfully', response);
          alert('Files uploaded successfully!');
        }, error:(error) => {
          console.error('Error uploading files', error);
          alert('File upload failed.');
        }
        });
    } else {
      alert('Please select at least one file.');
    }
  }

  titleTouched = false; // Track if the field has been touched

  validateTitle(value: string) {
    this.titleTouched = true;
  }

}
