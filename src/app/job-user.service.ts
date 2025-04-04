import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable,} from 'rxjs';
import { environment } from '../environments/environment';
import { DomSanitizer,SafeUrl } from '@angular/platform-browser';
 
interface User_details {
  id: number;
  userDescription: string;
  profession: string;
  permanentCity: string;
  permanentState: string;
  permanentCountry: string;
  phoneNumber: string;
  theme: string;
  bannerImage?: string;
  resume: string | null;
  user: {
    name: string;
    email: string;
    userImage: string;
  };
}
 
export interface Document {
  id: number;
  documentName: string;
  documentData: string;
  documentType: 'pdf' | 'word';  
  userId: number;
}
 
export interface User {
  id: number;
}
 
export interface UserSkills {
  skillName: string;
  level: string;
// id:number;
}
 
export interface Skill {
  id: number;          // Add the id property here
  skillName: string;
  level: 'AVERAGE' | 'SKILLED' | 'EXPERT';  // Assuming these are the levels
  isEditing?: boolean; // Optional property for tracking editing state
}
 
 
export interface Experience {
  id: number; // Unique identifier for the experience
  workRole: string; // Job title
  workCompanyName: string; // Company name
  workStartDate: string; // Start date of employment
  workEndDate: string; // End date of employment (optional if currently working)
  currentlyWorking: boolean; // If the user is still employed there
  workDescription: string; // Description of the work done
  isEditing: boolean;
}
 
export interface EducationDetail {
diplomaYearOfPassout: any;
diplomaYearOfJoining: any;
diplomaCollegeName: any;
diplomaCollegePercentage: any;
  // School Details
  schoolName?: string; // e.g., "KENDRIYA VIDYALAYA"
  schoolStatus?: string; // e.g., "Completed"
  schoolPercentage?: string; // e.g., "88%"
  schoolEducationBoard?: string; // e.g., "CBSE"
  schoolYearOfJoining?: number; // Year of joining school (e.g., 2005)
  schoolYearOfPassout?: number; // Year of passout from school (e.g., 2007)
 
  // Intermediate College Details
  intermediateDiploma?: string; // e.g., "Science"
  intermediateStatus?: string; // e.g., "Completed"
  intermediateCollegeName?: string; // e.g., "XYZ Junior College"
  intermediateCollegeSpecialization?: string; // e.g., "Science"
  intermediateCollegePercentage?: string; // e.g., "88%"
  intermediateYearOfJoining?: number; // Year of joining intermediate (e.g., 2007)
  intermediateYearOfPassout?: number;
  intermediateEducationBoard?:string; // Year of passing intermediate (e.g., 2009)
 
  // Graduation College Details
  graduationStatus?: string; // e.g., "Completed"
  graduationCollegeName?: string; // e.g., "Sri Vasavi Institute of Engineering"
  graduationCollegeSpecialization?: string; // e.g., "Computer Science"
  graduationCollegePercentage?: string; // e.g., "89%"
  graduationYearOfJoining?: number; // Year of joining graduation (e.g., 2010)
  graduationYearOfPassout?: number; // Year of passout from graduation (e.g., 2014)
  graduateEducationBoard?:string;
  // Post Graduation Details
  postGraduateStatus?: string; // e.g., "Not Pursued"
  postGraduateCollegeName?: string | null; // e.g., null
  postGraduateCollegeSpecialization?: string | null; // e.g., null
  postGraduateCollegePercentage?: string | null; // e.g., null
  postGraduateYearOfJoining?: number | null; // e.g., null
  postGraduateYearOfPassout?: number | null; // e.g., null
  postGraduateEducationBoard?: string;
 
  // General Details
  degree?: string; // e.g., "B.Tech"
  dateRange?: string; // Optional date range (e.g., "2010 - 2014")
  pursuingClass?: string; // If currently pursuing, e.g., "10th"
  createdAt?: string; // Timestamp of record creation
  isEditing?: boolean; // Flag to indicate if this item is being edited
 
  isEditingSchool?: boolean;
  isEditingIntermediate?: boolean;
  isEditingDiploma?: boolean;
  isEditingGraduation?: boolean;
  isEditingPostGraduate?: boolean;
 
}
 
 
export interface UserProjects {
  id?: number;
  projectName: string;
  projectDescription: string;
  client: string;
  startDate: Date;
  endDate: Date;
  skillsUsed: string;
  projectLink: string;
  projectImage?: File | string;
  projectVideo?: File | string ;
  SafeurlVideo : SafeUrl | null;
}
 
export interface Recruiter {
  id: number;
  recruiterName: string;
  recruiterEmail: string;
  recruiterPassword: string;
  recruiterRole?: string | null;
  jobAdmin?: any;
  recruiterJobs?: any;
}
 
export interface JobAdmin {
companyLocation: any;
companyPhoneNumber: any;
  id: number;
  companyDescription: string;
  jobAdminName: string;
  jobAdminEmail: string;
  jobAdminCompanyName: string;
  jobAdminPassword: string;
  jobAdminConfirmPassword?: string | null;
  companyLogo: Uint8Array;
}
 
export interface JobDetails {
  id: number;
  jobTitle: string;
  jobDescription: string;
  requiredSkills: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  jobType: string;
  status: string;
  vacancyCount: number;
  appliedCount: number;
  createdAt: number[];
  requiredEducation?: string | null ;
  requiredEducationStream?: string | null;
  requiredPercentage?: number | null;
  requiredPassoutYear?: number | null;
  requiredWorkExperience?: number | null;
  recruiter: Recruiter;
  jobAdmin: JobAdmin;
  basicJobQualification: string,
  primaryRoles: string,
  mainResponsibilities: string,
}

export interface JobApplication {
lastUpdated: string;
createdAt: number[];
menuOpen: any;
  id: number;
  job: {
    id: number;
    jobTitle: string;
    createdAt: number[];
  jobAdmin?: {
    id: number;
    jobAdminCompanyName: string;
    companyLogo: string;
  };
}
status:[];
withdraw:string;
 
}

// for getting quiz questions
export interface Question {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
}
 
export interface QuizDetail {
  userId: number;
  jobId: number;
  jobQuizId: number;
  quizName: string;
  recruiterId: number;
  questions: Question[]; // Array of questions
}
 
//Post Quiz Answers
export interface Result {
  questionId: number;
  selectedAnswer: string;
}
 
export interface SubmitAnswersResponse {
  recruiterId: number;
  recruiterName: string;
  recruiterEmail: string;
  jobQuizId: number;
  jobQuizName: string;
  jobId: number;
  userId: number;
  userName: string;
  userEmail: string;
  results: Result[];
  scorePercentage: number;
}
 
export interface QuizAnswerDetails {
  recruiterId: number;
  recruiterName: string;
  recruiterEmail: string;
  jobQuizId: number;
  jobQuizName: string;
  adminId: number | null;
  jobId: number;
  userId: number;
  userName: string;
  userEmail: string;
  questionId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

/////////////AI self introduction video integration///////
/////////getting combined video with time stamps/////
export interface SelfIntroductionVideoResponse {
  id?: number;
  siPersonalS3Uri?: string;
  siEducationS3Uri?: string;
  siWorkExperienceS3Uri?: string;
  siAchievementsS3Uri?: string;
  siCombinedS3Uri: string;
  selfIntroTimestamp: number;
  educationTimestamp: number;
  workExpTimestamp: number;
  achievementsTimestamp: number;
}
 
 
@Injectable({
  providedIn: 'root'
})
export class JobUserService {


  activeTab: string = 'jobs';
 
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  getActiveTab(): string {
    return this.activeTab;
  }
 
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private apiBaseUrl = environment.apiBaseUrl;
  private apiBaseUrlAI = environment.apiBaseUrlAI;
 
 
 
  getUserProfile(userId: number): Observable<User_details> {
    // console.log("I am Hitting")
    return this.http.get<User_details>(`${this.apiBaseUrl}/personalDetails/get/user/${userId}`);
  }
 
  setUserTheame(userId: number,theme : string): Observable<User_details>{
    return this.http.put<User_details>(`${this.apiBaseUrl}/personalDetails/update-theme/${userId}?theme=${theme.toUpperCase()}`,null)
  }
 
 
  setUserBanner(userId: number, file:File ): Observable<User_details> {
 
    const formData = new FormData();
    formData.append('bannerImage', file);
 
    return this.http.put<User_details>(
      `${this.apiBaseUrl}/personalDetails/update-banner/${userId}`,
      formData,{
        headers: new HttpHeaders({
            'enctype': 'multipart/form-data'
        })
    }
    );
 
  }
  
  getUserDocuments(userId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiBaseUrl}/api/user-documents/user/${userId}`);
  }
 
  // Upload a new document
  uploadDocument(formData: FormData, userId: number): Observable<Document> {
    return this.http.post<Document>(`${this.apiBaseUrl}/api/user-documents/add/${userId}`, formData);
  }
 
  // Delete a document
  deleteDocument(documentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/user-documents/${documentId}`);
  }
 
 addSkill(userId: number, skill: UserSkills): Observable<any> {
      console.log(this.http.post<any>(`${this.apiBaseUrl}/api/skills/create/${userId}`, skill, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }))
      return this.http.post<any>(`${this.apiBaseUrl}/api/skills/create/${userId}`, skill, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      });
    }
   
    getSkillsByUserId(userId: number): Observable<Skill[]> {
      const url = `${this.apiBaseUrl}/api/skills/user/${userId}`;
      return this.http.get<Skill[]>(url);
    }
   
    updateSkill(skillId: number, updatedSkill: any): Observable<any> {
      return this.http.put(`${this.apiBaseUrl}/api/skills/update/${skillId}`, updatedSkill);
    }
 
 
    getExperiencesByUserId(userId: number): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/workExperience/user/${userId}`);
    }
   
    getEducationByUserId(userId: number): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/education/user/${userId}`);
    }
   
    // POST: Create a new experience for a specific user
    addExperience(userId: number, experience: Experience): Observable<Experience> {
      return this.http.post<Experience>(`${this.apiBaseUrl}/workExperience/user/${userId}`, experience);
    }
   
    // POST: Create new education details for a specific user
    addEducation(userId: number, education: EducationDetail): Observable<EducationDetail> {
      return this.http.post<EducationDetail>(`${this.apiBaseUrl}/education/create/user/${userId}`, education);
    }
   
    // PUT: Update education details by userId and educationId
    updateEducation(userId: number, educationId: number, education: EducationDetail): Observable<EducationDetail> {
      return this.http.put<EducationDetail>(`${this.apiBaseUrl}/education/update/${userId}/${educationId}`, education);
    }
   
   
    //put :upadte details by userid and experience
    updateExperience(userId: number, experienceId: number, experience: any): Observable<any> {
      return this.http.put<any>(`${this.apiBaseUrl}/workExperience/update/${userId}/${experienceId}`, experience);
  }
 
 
  // project
 
 
  //////////////projects//////////////
      addOrUpdateProject(
userProfileId: number, projectName: string, client: string, projectDescription: string, startDate: string, endDate: string, projectClientName: string,  projectStartDate: string, projectEndDate: string, projectUrl: string, skillsUsed: string, technologiesUsed: string, projectTitle: string, projectLink: string, projectImage?: File | string, projectVideo?: File | string  ): Observable<UserProjects> {
        const formData = new FormData();
        formData.append('projectName', projectName);
        formData.append('client', client);
        formData.append('projectDescription', projectDescription);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('projectClientName', projectClientName);
        formData.append('projectStartDate', projectStartDate);
        formData.append('projectEndDate', projectEndDate);
        formData.append('projectUrl', projectUrl);
        formData.append('skillsUsed', skillsUsed);
        formData.append('technologiesUsed', technologiesUsed);
        formData.append('projectLink', projectLink);
        formData.append('projectTitle', projectTitle);
     
        if (projectImage instanceof File) {
          formData.append('projectImage', projectImage, projectImage.name);
        } else if (typeof projectImage === 'string') {
          formData.append('projectImage', projectImage);
        }
     
        if (projectVideo instanceof File) {
          formData.append('projectVideo', projectVideo, projectVideo.name);
        } else if (typeof projectVideo === 'string') {
          formData.append('projectVideo', projectVideo);
        }
     
        return this.http.post<UserProjects>(`${this.apiBaseUrl}/api/projects/addOrUpdate/${userProfileId}`, formData);
      }
     
     
      getProjectsByUserId(userId: number): Observable<UserProjects[]> {
        return this.http.get<UserProjects[]>(`${this.apiBaseUrl}/api/projects/user/${userId}`);
      }
   
      ////////////////////////////////////
      ///////////////update project//////////
      updateProject(
        userId: number,
        projectId: number,
        projectName: string,
        projectDescription: string,
        client: string,
        startDate: Date,
        endDate: Date,
        skillsUsed: string,
        projectLink: string,
        projectImage?: File | string,
        projectVideo?: File | string
      ): Observable<UserProjects> {
        const url = `${this.apiBaseUrl}/api/projects/update/${userId}/${projectId}`;
     
        // Prepare the form data
        const formData = new FormData();
        formData.append('projectName', projectName);
        formData.append('client', client);
        formData.append('projectDescription', projectDescription);
        formData.append('startDate', startDate.toISOString().split('T')[0]);
        formData.append('endDate', endDate.toISOString().split('T')[0]);
        formData.append('skillsUsed', skillsUsed);
        formData.append('projectLink', projectLink);
     
        if (projectImage instanceof File) {
          formData.append('projectImage', projectImage, projectImage.name);
        } else if (typeof projectImage === 'string') {
          formData.append('projectImage', projectImage);
        }
     
        if (projectVideo instanceof File) {
          formData.append('projectVideo', projectVideo, projectVideo.name);
        } else if (typeof projectVideo === 'string') {
          formData.append('projectVideo', projectVideo);
        }
     
        // Make the PUT request
        return this.http.put<UserProjects>(url, formData);
      }
     
 
 
 
      ///////////////////////////////////////
 
      // get method for About Company
 
//       getJobDetails(jobId: number): Observable<JobDetails> {
//         return this.http.get<JobDetails>(`${this.apiBaseUrl}/api/jobs/${jobId}`)    
// }
 
 
getJobDetails(jobId: number): Observable<JobDetails> {
  return this.http.get<JobDetails>(`${this.apiBaseUrl}/api/jobs/${jobId}`)
}

applyJob(jobId :number, userId:number, resume:File): Observable<any>{
  const formData = new FormData();
  formData.append('resume', resume); // append your file object here

  return this.http.post<any>(`${this.apiBaseUrl}/api/applications/${jobId}/${userId}`,formData)
}

saveJob(userId: number, jobId: number): Observable<any> {
  return this.http.post<any>(`${this.apiBaseUrl}/api/savedJobs/save/${userId}/${jobId}`, {});
}

getSavedJobsByUserId(userId: number): Observable<JobDetails[]> {
  // Dynamically use the userId passed to the method
  return this.http.get<JobDetails[]>(`${this.apiBaseUrl}/api/savedJobs/getUser/${userId}`);
}

getUserApplications(userId: number): Observable<JobApplication[]> {
  return this.http.get<JobApplication[]>(`${this.apiBaseUrl}/api/applications/user/${userId}`)
}


 
withdrawJobApplication(applicationId: number): Observable<any> {
  return this.http.put(`${this.apiBaseUrl}/api/applications/${applicationId}/withdraw`, {});
}
 
reapplyJobApplication(applicationId: number): Observable<string> {
  return this.http.put(`http://localhost:8080/api/applications/${applicationId}/reapply`, null, {
    responseType: 'text' // Correctly specify response type
  }); 
}
 
//quiz questions
//quiz questions
getUserJobQuizzes(jobId: number, userId: number): Observable<QuizDetail[]> {
  return this.http.get<QuizDetail[]>(
    `${this.apiBaseUrl}/api/jobquiz/${jobId}/user/${userId}/details`
  );
}
 
 
//Post quiz Answers
//Posting Answers
submitAnswersWithPercentage(
  jobQuizId: number,  // jobQuizId should be a number, not an array
  userId: number,
  results: Result[]
): Observable<SubmitAnswersResponse> {
  const url = `${this.apiBaseUrl}/api/answers/jobquiz/${jobQuizId}/user/${userId}/submitanswerswithpercentage`;
  return this.http.post<SubmitAnswersResponse>(url, results, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
 
}

getuserfeedbacks(userId: number, jobId:number): Observable<JobApplication[]> {
  return this.http.get<JobApplication[]>(`${this.apiBaseUrl}/api/interviews/interviewDetails/${jobId}/user/${userId}`)
}




////////////AI self introduction video integration///////
combineVideos(userId: number): Observable<any> {
  const payload = { user_id: userId };
  return this.http.post(`${this.apiBaseUrlAI}/combine_videos`, payload);
}

////////////////service///////

/////////////AI self introduction video integration///////
/////////getting combined video with time stamps/////
getSelfIntroVideoData(userId: number): Observable<SelfIntroductionVideoResponse> {
  return this.http.get<SelfIntroductionVideoResponse>(`${this.apiBaseUrl}/selfIntroductionVideos/combined/${userId}`);
}

getIndividualVideos(userId: number): Observable<SelfIntroductionVideoResponse> {
  return this.http.get<SelfIntroductionVideoResponse>(`${this.apiBaseUrl}/selfIntroductionVideos/get/${userId}`);
}


getRecommendations(userId: number, jobId: number) {
  const url = `${this.apiBaseUrlAI}/job_feedback_course/${userId}/${jobId}`;
  return this.http.get(url);
}


 
// PUT method for self-introduction videos in the service
updateSelfIntroductionVideos(
  userId: number,
  personalVideo?: File | null,
  educationVideo?: File | null,
  workExperienceVideo?: File | null,
  achievementsVideo?: File | null
): Observable<string> {
  const formData = new FormData();
 
  if (personalVideo) {
    formData.append('personalVideo', personalVideo);
  }
  if (educationVideo) {
    formData.append('educationVideo', educationVideo);
  }
  if (workExperienceVideo) {
    formData.append('workExperienceVideo', workExperienceVideo);
  }
  if (achievementsVideo) {
    formData.append('achievementsVideo', achievementsVideo);
  }
 
  return this.http.put(
    `${this.apiBaseUrl}/selfIntroductionVideos/videos/${userId}`,
    formData,
    { responseType: 'text' } // Specify the response type as text
  );
}
 
 
withdrawApplication(applicationId: number): Observable<any> {
  return this.http.put<any>(`${this.apiBaseUrl}/api/applications/${applicationId}/withdraw`, {});
}

reapplyForJob(applicationId: number): Observable<string> {
  return this.http.put<string>(`${this.apiBaseUrl}/api/applications/${applicationId}/reapply`, {}, { 
    responseType: 'text' as 'json'  
  });
}
 unsaveJob(jobId: number, userId: number): Observable<string> {
  const url = `${this.apiBaseUrl}/api/savedJobs/unsave/${jobId}/${userId}`;
  return this.http.delete(url, { responseType: 'text' });
}


// isanswerd
isJobQuizzesAnsered(jobQuizId: number, userId: number): Observable<boolean> {
  return this.http.get<boolean>(`http://localhost:8080/api/answers/isAnswered?userId=${userId}&jobQuizId=${jobQuizId}`)
}

}
 
 