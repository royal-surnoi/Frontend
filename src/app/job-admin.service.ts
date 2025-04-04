import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse,} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
 
export interface JobAdmin {
  id: number;
  jobAdminName: string;
  jobAdminEmail: string;
  jobAdminCompanyName: string;
  jobAdminPassword: string;
  jobAdminConfirmPassword?: string; // Optional since it's marked as @Transient
 
  // Company-related fields
  companyLogo: Uint8Array; // Use Uint8Array for binary data
  companyDescription: string;
  companyTypeOfIndustry: string;
  companyWebsiteLink: string;
  companyStrength: number;
  companyLocation: string;
  companyLicense: string;
  companyPhoneNumber:any;
  companyAboutDescription:string;
  companyOverviewDescription:string;
  companyLicenseDocument: Uint8Array;
  companyGstNumber: string;
  companyGstDocument: Uint8Array;
  companyCinNumber: string;
  companyCinDocument: Uint8Array;
  companyLatitude:any;
  companyLongitude:any;
  descriptionBackground: Uint8Array;
  aboutBackground: Uint8Array;
  addJobBackground: Uint8Array;
  overviewBackground: Uint8Array;
  contactBackground: Uint8Array;
 
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
  numberOfLevels?: number;
  basicJobQualification: string;
  primaryRoles: string;
  mainResponsibilities: string;
}

export interface Recruiter {
  recruiterId: any;
  id: number;
  recruiterName: string;
  recruiterEmail: string;
  recruiterRole: string;
  showOptions: boolean; // Add this property
  createdAt: number[];  // Timestamp array similar to jobs
  relativeTime: string;
  recruiterPassword?: string; 
  recruiterDeportment?: string;
 
}

 
@Injectable({
  providedIn: 'root'
})
export class JobAdminService {
 
  registerJobAdmin(arg0: number, formData: FormData) {
    throw new Error('Method not implemented.');
  }
  private apiBaseUrl = environment.apiBaseUrl;
 
  constructor(private http: HttpClient) {}
 
  updateCompany(jobAdminId: number, formData: FormData): Observable<any> {
    return this.http.patch(`${this.apiBaseUrl}/jobAdmin/updateCompany/${jobAdminId}`, formData);
  }
 
  getJobAdminById(jobAdminId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/jobAdmin/get/${jobAdminId}`);
  }
 
    // Method to create a new job
    createJob(adminId: number, job: Job): Observable<Job>{
      const url = `${this.apiBaseUrl}/api/jobs/createJob/${adminId}`;
      console.log(job)
      return this.http.post<Job>(url, job);
    }
 
    // Update Company Location
  updateCompanyLocation(jobAdminId: number, formData: FormData) {
    const url = `${this.apiBaseUrl}/jobAdmin/updateLocation/${jobAdminId}`;
    return this.http.patch(url, formData);
  }
 
 
  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error || 'Server error');
  }

  getRecruitersByJobAdminId(jobAdminId: number): Observable<Recruiter[]> {
    const url = `${this.apiBaseUrl}/api/jobs/recruiters/${jobAdminId}`;
    return this.http.get<Recruiter[]>(url).pipe(catchError(this.handleError));
  }

  updateRecruiterDetails(
    recruiterId: number,
    adminId: number,
    updatedRecruiter: Partial<Recruiter>
  ): Observable<Recruiter> {
    const url = `${this.apiBaseUrl}/api/recruiters/updateRecruiterDetails/${recruiterId}/${adminId}`;
    return this.http.put<Recruiter>(url, updatedRecruiter);
  }

  // updated
 
  // Get jobs by adminId
  getJobsByAdminId(adminId: number): Observable<Job[]> {
    const url = `${this.apiBaseUrl}/api/jobs/admin/${adminId}`;
    return this.http.get<Job[]>(url);
  }
 
  // Get active jobs by adminId
getActiveJobsByAdminId(adminId: number): Observable<Job[]> {
  const url = `${this.apiBaseUrl}/api/jobs/active?jobAdminId=${adminId}`;
  return this.http.get<Job[]>(url);
}

getActiveJobsByAdminId2(adminId: number): Observable<Job[]> {
  const url = `${this.apiBaseUrl}/api/jobs/activeAdminJobs?jobAdminId=${adminId}`;
  return this.http.get<Job[]>(url);
}

  // Delete a job by adminId and jobId
  deleteJob(adminId: number, jobId: number): Observable<string> {
    const url = `${this.apiBaseUrl}/api/jobs/deleteJob/${adminId}/${jobId}`;
    return this.http.delete<string>(url);
  }
 
  // Update a job by jobId and adminId
  updateJob(jobId: number, adminId: number, updatedJob: Job): Observable<Job> {
    const url = `${this.apiBaseUrl}/api/jobs/updateJob/${jobId}/${adminId}`;
    return this.http.put<Job>(url, updatedJob);
  }

  
  adminshortlistApplicant(jobId: number, applicantId: number, body: { status: string; adminId: string }): Observable<any> {
    return this.http.post<any>(
      `${this.apiBaseUrl}/api/shortlisted/${jobId}/${applicantId}`,
      body
    );
  }

   

// job.service.ts
updateJobStatus(jobId: number, adminid: any, status: string): Observable<any> {
  // Make sure the URL is correct
  const url = `${this.apiBaseUrl}/api/jobs/${jobId}/status?status=${status}&jobAdminId=${adminid}`;
  return this.http.put(url, {},{ responseType: 'text' }
  );
}

 
}
 
 