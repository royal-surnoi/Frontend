import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
 
 
 
export interface AssignQuizRequest {
  quizName: string;        // The name of the quiz
  startDate: string;       // The start date of the quiz (formatted as a string)
  endDate: string;         // The end date of the quiz (formatted as a string)
  shortlistedIds: number[]; // List of shortlisted IDs (numbers)
  userIds: number[];
}
 
export interface JobQuizResponse {
  id: number;
  quizName: string;
  startDate: string;
  endDate: string;
  recruiterId: number;
  shortlistedIds: number[];
}
 
export interface Question {
  // id?: number;
  jobQuizId:number;
  questionText: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer
}
 
 
export interface JobAdmin {
  id: number;
  job: any;
  jobAdminName: string;
  jobAdminEmail: string;
  jobAdminCompanyName: string;
  jobAdminPassword: string;
  jobAdminConfirmPassword: string | null;
  companyLogo: string | null;
  companyDescription: string | null;
  companyTypeOfIndustry: string | null;
  companyWebsiteLink: string | null;
  companyStrength: number;
  companyLocation: string | null;
  companyLicense: string | null;
  companyLicenseDocument: string | null;
  companyGstNumber: string | null;
  companyGstDocument: string | null;
  companyCinNumber: string | null;
  companyCinDocument: string | null;
  jobs: any | null;
}
export interface Job {
  jobTitle: string;
  jobDescription: string;
  requiredSkills: string;
  location: string;
  minSalary?: number;
  maxSalary?: number;
  jobType?: string;
  status?: string;
  vacancyCount?: number;
  appliedCount?: number;
  requiredEducation: string,
  requiredEducationStream: string,
  requiredPercentage: string,
  requiredPassoutYear: string,
  requiredWorkExperience: string,
}
 
export interface JobAdminDetails {
  id: number;
  jobAdminEmail: string;
  jobAdminCompanyName: string;
  companyLogo: string | SafeUrl;
  companyDescription: string;
  companyTypeOfIndustry: string;
  companyStrength: string;
  companyLocation: string;
  companyPhoneNumber: string;
  companyWebsiteLink: string;
 
}
export interface RecruiterDetails  {
  id: number;
  recruiterName: string;
  recruiterEmail: string;
  recruiterRole: string | null;
}
 
 
export interface Recruiter {
  recruiter: RecruiterDetails ;
  jobAdmin: JobAdminDetails;
}
 
export interface Applicant {
  id: number;
  applyJobId?: number;
  name: string;
  userEmail: string;
  userImage: Uint8Array; // Use Uint8Array for binary data
  applicationStatus: string;
  createdAt: number[];
  resume: string;
  educationDetails: {
    graduationCollegeSpecialization: string;
    postGraduateCollegeSpecialization: string;
    graduationStatus: string;
  }
}
 
export interface Applicant {
  applicantId: number;
  applyJobId?: number;
  name: string;
  userEmail: string;
  userImage: Uint8Array; // Use Uint8Array for binary data
  applicationStatus: string;
  createdAt: number[];
  resume: string;
  status: string;
  educationDetails: {
    graduationCollegeSpecialization: string;
    postGraduateCollegeSpecialization: string;
    graduationStatus: string;
  }
}
 
export interface JobInterviewDetails {
  id?: number;
  userId: number;
  userName: string;
  userEmail: string;
  recruiterId: number;
  recruiterName: string;
  recruiterEmail: string;
  interviewTimestamp: string | null;
  interviewLink: string | null;
  interviewScoreLink: string | null;
  interviewDescription: string | null;
  interviewerEmail: string | null;
  interviewerName: string | null;
  interviewerScore: number | null;
  interviewerFeedback: string | null;
  currentLevel: string;
  upcomingLevel: string;
  currentFeedback: string;
}
 
export interface JobadminInterviewDetails {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  recruiterId: number | null; // nullable
  recruiterName: string | null; // nullable
  recruiterEmail: string | null; // nullable
  interviewTimestamp: string | null;
  interviewLink: string | null;
  interviewScoreLink: string | null;
  interviewDescription: string | null;
  interviewerEmail: string | null;
  interviewerName: string | null;
  interviewerScore: number | null;
  interviewerFeedback: string | null;
  currentLevel: string;
  upcomingLevel: string;
  currentFeedback: string;
  adminId?: number; // Optional admin ID
  adminName?: string; // Optional admin name
  adminEmail?: string; // Optional admin email
}
 
 
 
@Injectable({
  providedIn: 'root'
})
export class JobRecruiterService {
 
  private apiBaseUrl = environment.apiBaseUrl;
  private apiBaseUrlAI = environment.apiBaseUrlAI;
 
  constructor(private http: HttpClient) { }
 
  private handleError(error: HttpErrorResponse) {
    return throwError(() =>new Error(error.error || 'Server error'));
  }
  // ------------------------------SHIVA------------------------------------------
 
  //get adminID by recruiterID
  getAdminByRecruiterId(recruiterId: number): Observable<JobAdmin> {
    return this.http.get<JobAdmin>(`${this.apiBaseUrl}/api/recruiters/admins/${recruiterId}`)
      .pipe(catchError(this.handleError));
  }
 
  // Method to create a new job
  createJob(adminId: number, recruiterId: number, job: Job): Observable<Job> {
    const url = `${this.apiBaseUrl}/api/jobs/createJob/${adminId}/${recruiterId}`;
    return this.http.post<Job>(url, job).pipe(catchError(this.handleError));
  }
  // ----------------------------------SHIVA END-------------------------------------------------
 
  //job recruitment get///
 
  getActiveJobsByRecruiterId(recruiterId: number): Observable<Job[]> {
    const url = `${this.apiBaseUrl}/api/jobs/active?recruiterId=${recruiterId}`;
    return this.http.get<Job[]>(url).pipe(catchError(this.handleError));
  }
  
 
 
 
  getRecruiterById(id: number): Observable<Recruiter> {
    return this.http.get<Recruiter>(`${this.apiBaseUrl}/api/recruiters/adminsRecruiters/${id}`);
  }
 
  getApplicationsByJobId(jobId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/api/applications/getApplicants/${jobId}`);
  }

  getApplicationsWithEducationByJobId(jobId: number): Observable<Map<string, any>> {
    const url = `${this.apiBaseUrl}/api/applications/getApplicants/${jobId}`;
    return this.http.get<Map<string, any>>(url);
  }
 
  updateJobByRecruiter(jobId: number, recruiterId: number, updatedJob: Job): Observable<Job> {
    const url = `${this.apiBaseUrl}/api/jobs/update/${jobId}/${recruiterId}`;
    return this.http.put<Job>(url, updatedJob);
  }
  deleteJob(jobId: number, recruiterId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/jobs/delete/${jobId}/${recruiterId}`);
  }
 
  /*----------post method for shortlist----------*/
  shortlistApplicant(jobId: number, applicantId: number, body: { status: string; recruiterId: string; }): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}/api/shortlisted/${jobId}/${applicantId}`,
      body
    );
  }
 
 
 
  getShortlistedCandidates(jobId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/api/shortlisted/job/${jobId}`);
  }
 
  assignQuiz(request: AssignQuizRequest, recruiterId: any, jobId: any): Observable<JobQuizResponse> {
    const url = `${this.apiBaseUrl}/api/jobquiz/${recruiterId}/${jobId}`;
    const params = new HttpParams()
      .set('quizName', request.quizName)
      .set('startDate', request.startDate) // Should be formatted as 'yyyy-MM-dd'
      .set('endDate', request.endDate) // Should be formatted as 'yyyy-MM-dd'
      .set('userIds', request.userIds.join(',')); // Ensure 'userIds' is correctly set as a comma-separated string
 
    return this.http.post<JobQuizResponse>(url, null, { params });
  }
 
 
  submitQuizQuestions(jobId: any[], jobQuizId: number, questions: any[]): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/api/jobquiz/${jobId}/${jobQuizId}/questions`; // Include jobId and jobQuizId in the URL
    return this.http.post<any>(apiUrl, questions); // Send questions as the request body
  }
 
 
 
 
  shortlistMultipleCandidates(jobId: number, body: { applicantIds: number[]; status: string; recruiterId: string }): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}/api/shortlisted/shortlistMultipleCandidates/${jobId}`;
    console.log('Calling API:', apiUrl, body);
    return this.http.post<any>(apiUrl, body);
  }
 
  // Method to get user data based on recruiterId and jobId
getUserData(recruiterId: string, jobId: number): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/api/answers/getProgress/${jobId}/${recruiterId}`);
}
 
getadminUserData(adminId: string, jobId: number): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/api/answers/getProgressByAdmin/${jobId}/${adminId}`);
}
 
// Method to submit feedback for admin
submitadminFeedback(feedbackadminData: any, jobId: any): Observable<any> {
  return this.http.post<any>(`${this.apiBaseUrl}/api/interviews/shortlist?jobId=${jobId}`, feedbackadminData);
}
 
// Method to submit feedback for recruiter
submitFeedback(feedbackData: JobInterviewDetails, jobId: number): Observable<any> {
  const params = new HttpParams().set('jobId', jobId);
  return this.http.post<any>(`${this.apiBaseUrl}/api/interviews/shortlist`, feedbackData, { params });
}
 
  updateInterviewDetails(id: number, updatedDetails: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/api/interviews/update/${id}`, updatedDetails);
  }
 
  shortlistCandidateByAdmin(adminId: number, applyJobId: number, status: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/shortlisted/candidate`;
    const params = { adminId, applyJobId, status };
    return this.http.post(url, {}, { params, responseType: 'text' });
  }
 
   
  shortlistCandidatesBulk(adminId: number, candidates: { applyJobId: number; status: string }[]): Observable<any> {
    const url = `${this.apiBaseUrl}/api/shortlisted/multiple-candidates`;
    const body = { adminId, candidates };
    return this.http.post(url, body);
  }
   
 
  shortlistMultipleCandidates1(payload: { adminId: number; candidates: { applyJobId: number; status: string }[] }): Observable<any> {
    const url = `${this.apiBaseUrl}/api/shortlisted/multiple-candidates`;
    return this.http.post(url, payload,{
      responseType: 'text'
    });
  }
 
 
// Service Method
assignQuizByAdmin(
  request: any,
  adminId: number,
  jobId: number
): Observable<any> {
  const url = `${this.apiBaseUrl}/api/jobquiz/admin/${adminId}/job/${jobId}`;
  return this.http.post<any>(url, request);
}
 
 
// Updated Service Method
// assignQuizByAdmin(request: any, adminId: number, jobId: number): Observable<any> {
//   const url = `${this.apiBaseUrl}/api/jobquiz/admin/${adminId}/job/${jobId}`;
 
 
 
getInterviewDetails(jobId: number, userId: number): Observable<any> {
  const url = `${this.apiBaseUrl}/api/interviews/interviewDetails/job/${jobId}/${userId}`;
  return this.http.get(url);
}
 
getRecruitersByJobAdminAndRole(jobAdminId: number, recruiterRole: string): Observable<{ [key: string]: Array<{ recruiterEmail: string; recruiterName: string; id: number }> }> {
  const url = `${this.apiBaseUrl}/api/recruiters/by-job-admin/${jobAdminId}?recruiterRole=${recruiterRole}`;
  return this.http.get<{ [key: string]: Array<{ recruiterEmail: string; recruiterName: string; id: number }> }>(url);
}
 
getJobAdminIdByRecruiterId(recruiterId: number): Observable<number> {
  const url = `${this.apiBaseUrl}/api/recruiters/${recruiterId}/jobAdminId`; // Update with actual endpoint
  return this.http.get<number>(url);
}
 
getByAdminAndRole(jobAdminId: number, recruiterRole: string) {
  const url = `${this.apiBaseUrl}/api/recruiters/by-job-admin/${jobAdminId}?recruiterRole=${encodeURIComponent(recruiterRole)}`;
  return this.http.get<{ [key: string]: Array<{ recruiterEmail: string; recruiterName: string; id: number }> }>(url);
}
 
 
 
 
  // getRecruitersByJobAdminAndRole(jobAdminId: number, recruiterRole: string): Observable<{ [key: string]: Array<{ recruiterEmail: string; recruiterName: string; id: number }> }> {
  //   const url = `${this.apiBaseUrl}/api/recruiters/by-job-admin/${jobAdminId}?recruiterRole=${recruiterRole}`;
  //   return this.http.get<{ [key: string]: Array<{ recruiterEmail: string; recruiterName: string; id: number }> }>(url);
  // }
 
  // getJobAdminIdByRecruiterId(recruiterId: number): Observable<number> {
  //   const url = `${this.apiBaseUrl}/api/recruiters/${recruiterId}/jobAdminId`; // Update with actual endpoint
  //   return this.http.get<number>(url);
  // }

  getApplicationsByJobIdAI(jobId: number): Observable<any> {
    // Create a request body with the job ID
    const requestBody = {
      job_id: jobId
    };
 
    return this.http.post<any[]>(`${this.apiBaseUrlAI}/shortlist_hr/`, requestBody);
  }

  getJobByJobId(jobId: number): Observable<any> { 
    return this.http.get<any>(`${this.apiBaseUrl}/api/jobs/${jobId}`);
  }

  updateJobhold(jobId: number, recruiterId: number, status: string): Observable<any> {
    // Construct the API endpoint with the correct parameters
    const url = `${this.apiBaseUrl}/api/jobs/${jobId}/status?status=${status}&recruiterId=${recruiterId}`;
    return this.http.put(url, {}, { responseType: 'text' });
  }
}
 