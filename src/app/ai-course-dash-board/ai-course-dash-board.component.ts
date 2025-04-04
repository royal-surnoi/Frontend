import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';


interface ChatRequest {
  user_id: number;
  course_plan_id: number;
  query: string;
}

interface ChatResponse {
  response: string;
}

interface CoursePlan {
  id: number;
  weekNumber: number;
  mainTopicTitle: string;
  explanation: string;
  videoS3Url: string;
}

interface AssignmentDetails {
  "Assignment Description": string;
  "Tasks": string[];
}

interface Assignment {
  id: number;
  weekNumber: number;
  aiCourseAssignment: string;
  parsedAssignment?: AssignmentDetails;
  aiCourseAssignmentUserAnswer?: string;
}

interface Project {
  id: number;
  weekNumber: number;
  aiCourseProject: string;
  aiCourseProjectUserAnswer?: string;
}


interface ChatMessage {
  query: string;
  response: string;
  timestamp: string;
}

type ContentItem = CoursePlan | Assignment | Project;

@Component({
  selector: 'app-ai-course-dash-board',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ai-course-dash-board.component.html',
  styleUrl: './ai-course-dash-board.component.css'
})
export class AICourseDashBoardComponent {
  coursePlan: CoursePlan[] = [];
  assignments: Assignment[] = [];
  projects: Project[] = [];
  selectedWeek: number = 1;
  selectedContent: ContentItem | null = null;
  id: any;
  chatHistory: ChatMessage[] = [];
  userInput = '';
  isOpen = false;
  isLoading = false;
  data: any = {};
  userId: any;
  iscompleted: boolean = false;
  private apiBaseUrlAI = environment.apiBaseUrlAI;
  course: any;
  Desc:boolean = true;



  private apiUrl = `${this.apiBaseUrlAI}/ai_course_chatbot/ai_course`;
  private deleteSessionUrl = `${this.apiBaseUrlAI}/delete-courseGPTsession/clear`;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = +params['id']; // Ensure jobId is a number
      this.userId = localStorage.getItem('id');
      this.loadContent();
      this.getCourse();
    });
  }

  ngOnDestroy() {
    if (this.http) {
      const request: any = {
        user_id: this.userId,
        course_plan_id: this.id
      };

      this.http.get(this.deleteSessionUrl, request).subscribe({
        next: () => console.log('Session deleted successfully'),
        error: (error) => console.error('Error deleting session:', error)
      });
    }
  }

  getCourse() {
    this.http.get<any>(`http://localhost:8080/aiCoursePlans/${this.id}`).subscribe(
      {next:(data) => {
        this.course = data;
        this.selectWeek(0);
      },
      error:(error) => console.error('Error fetching course plan:', error)
    }
    );
  }

  loadContent() {
    this.http.get<CoursePlan[]>(`http://localhost:8080/aiCoursePlans/bycourseplan/${this.id}`).subscribe({
      next: (data) => {
        this.coursePlan = data;
      },
      error: (error) => console.error('Error loading course plan:', error)
    });

    this.http.get<Assignment[]>(`http://localhost:8080/ai-course-assignments/bycourseplan/${this.id}`).subscribe({
      next: (data) => {
        console.log(data)
        this.assignments = data},
      error: (error) => console.error('Error loading assignments:', error)
    });

    this.http.get<Project[]>(`http://localhost:8080/project/by-course-plan/${this.id}`).subscribe({
      next: (data) => this.projects = data,
      error: (error) => console.error('Error loading projects:', error)
    });
  }

  getAllWeeks(): number[] {
    const allWeeks = new Set([
      ...this.coursePlan.map(item => item.weekNumber),
      ...this.assignments.map(item => item.weekNumber),
      ...this.projects.map(item => item.weekNumber)
    ]);
    return Array.from(allWeeks).sort((a, b) => a - b);
  }
  

  getTopicsForWeek(week: number): CoursePlan[] {
    return this.coursePlan.filter(item => item.weekNumber === week);
  }

  getAssignmentsForWeek(week: number): Assignment[] {
    return this.assignments.filter(item => item.weekNumber === week);
  }

  getProjectsForWeek(week: number): Project[] {
    return this.projects.filter(item => item.weekNumber === week);
  }

  selectWeek(week: number) {
    if(week!=0){
    this.Desc = false;
    this.selectedWeek = week;
    const weekContent = this.getTopicsForWeek(week);
    if (weekContent.length > 0) {
      this.selectedContent = weekContent[0];
    }
    }
    else{
      this.Desc = true;
    }
  }

  selectVideo(video: CoursePlan) {
    this.selectedContent = video;
  }

  answerwrite:string = '';

  selectAssignment(assignment: Assignment) {
    assignment.parsedAssignment = this.getAssignmentDetails(assignment.aiCourseAssignment);
    this.selectedContent = assignment;
    this.answerwrite = assignment.aiCourseAssignmentUserAnswer || ''
    this.data = JSON.parse(assignment.aiCourseAssignment);
  }

  selectProject(project: Project) {
    this.selectedContent = project;
    this.answerwrite = project.aiCourseProjectUserAnswer || ''
    this.data = JSON.parse(project.aiCourseProject);
  }

  isVideo(content: ContentItem): content is CoursePlan {
    return 'videoS3Url' in content;
  }

  isAssignment(content: ContentItem): content is Assignment {
    return 'aiCourseAssignment' in content;
  }

  isProject(content: ContentItem): content is Project {
    return 'aiCourseProject' in content;
  }

  getCurrentVideo(): string {
    if (this.selectedContent && this.isVideo(this.selectedContent)) {
      return this.selectedContent.videoS3Url || "http://techslides.com/demos/sample-videos/small.mp4";
    }
    return '';
  }

  getAssignmentDetails(assignment: string): AssignmentDetails {
    try {
      return JSON.parse(assignment);
    } catch {
      return {
        "Assignment Description": "No assignment description available",
        "Tasks": []
      };
    }
  }

  answer: string = '';

  saveanswer(answer: string) {
    this.answer = answer;
    console.log(this.answer);
  }

  submitAssignmentAnswer(answer: string | undefined, id: any) {

    if(answer == undefined || answer.split(' ').length<2 || answer == ''){
      alert("Answer Must Be grater Then 1 Word")
      return
    }

    alert("Submitting"+answer.split(' '))

    this.iscompleted = false;
    this.tempdata = {};
    this.openOverlay()
    this.http.put<any>(`http://localhost:8080/ai-course-assignments/${id}/answer`, answer).subscribe({
      next: (data) => {
        this.AnlysisAssignmentByAI(data)
      },
      error: (error) => alert("Something went wrong!!")
    });
  }

  AnlysisAssignmentByAI(data: any) {
    const body: any =
    {
      user_id: this.userId,
      id: data.id
    }

    this.http.post<any>(`${this.apiBaseUrlAI}/ai_course_evaluate_assignment`, body).subscribe({
      next: (data) => {
        console.log(data)
        this.tempdata = data;
        this.iscompleted = true;
      },
      error: (error) => {
        if (error.status === 500) {
          alert("Sorry, you recently attempted. Try again after some time.");
        } else {
          alert("Something went wrong!!");
        }
        this.closeOverlay()
      }
    });
  }

  submitProjectAnswer(answer: string | undefined, id: any) {
    if(answer == undefined || answer.split(' ').length<2 || answer == ''){
      alert("Answer Must Be grater Then 1 Word")
      return
    }

    this.iscompleted = false;
    this.tempdata = {};
    this.openOverlay();
    this.http.put<any>(`http://localhost:8080/project/${id}/answer`, answer).subscribe({
      next: (data) => {
        this.AnlysisProjectByAI(data)
      },
      error: (error) => {
        if (error.status === 500) {
          alert("Sorry, you recently attempted. Try again after some time.");
        } else {
          alert("Something went wrong!!");
        }
        this.closeOverlay()
      }
    });
  }

  AnlysisProjectByAI(data: any) {
    const body: any =
    {
      user_id: this.userId,
      id: data.id
    }

    this.http.post<any>(`${this.apiBaseUrlAI}/ai_course_evaluate_project/`, body).subscribe({
      next: (data) => {
        console.log(data);
        this.tempdata = data;
        this.iscompleted = true
      },
      error: (error) => {
        if (error.status === 500) {
          alert("Sorry, you recently attempted. Try again after some time.");
        } else {
          alert("Something went wrong!!");
        }
        this.closeOverlay()
      }
    });
  }

  verifyanswer(answer:string | undefined){
    if(answer == undefined || answer.split(' ').length<2 || answer == ''){
      return false;
    }
    return true;
  }



  toggleChat() {
    this.isOpen = !this.isOpen;
    this.scrollToBottom();
  }

  clearChat() {
    const request: any = {
      user_id: this.userId,
      course_plan_id: this.id
    };
    this.http.post(this.deleteSessionUrl, request).subscribe();
    this.chatHistory = [];
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const query = this.userInput;
    this.isLoading = true;

    const request: ChatRequest = {
      user_id: this.userId,
      course_plan_id: this.id,
      query: query
    };


    this.http.post<ChatResponse>(this.apiUrl, request).subscribe({
      next: (response) => {
        const newMessage: ChatMessage = {
          query: query,
          response: response.response,
          timestamp: new Date().toISOString()
        };
        this.chatHistory.push(newMessage);
        this.userInput = '';
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  }

  isOverlayOpen = false;
  tempdata: any;

  openOverlay() {
    this.isOverlayOpen = true;
  }

  closeOverlay() {
    this.isOverlayOpen = false;
  }

  isTimeDifferenceGreaterThan30Minutes(createdAt: string): boolean {
    const createdTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
  
    // Calculate the time difference in milliseconds
    const timeDifference = currentTime - createdTime;
  
    // Convert 30 minutes to milliseconds (30 * 60 * 1000)
    const thirtyMinutesInMs = 30 * 60 * 1000;
  
    // Return true if the difference is greater than 30 minutes
    return timeDifference > thirtyMinutesInMs;
  }
}

