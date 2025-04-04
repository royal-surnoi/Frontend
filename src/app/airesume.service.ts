import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface AIGenerateResponse {
  suggestions: string;
  condensed: string;
  extended: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiresumeService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  generateEducationDescription(educationData: any, jobId?: number, userDescription?: string): Observable<AIGenerateResponse> {
    const payload: any = {
      school_name_or_college_name: educationData.instituteName,
      degree_major: `${educationData.degree} ${educationData.specialization}`
    };
 
    if (jobId) payload.job_id = jobId;
    if (userDescription) payload.user_description = userDescription;
 
    return this.http.post<AIGenerateResponse>(`${this.baseUrl}/airesume/education_description`, payload);
  }
 
  generateWorkDescription(workData: any, jobId?: number, userDescription?: string): Observable<AIGenerateResponse> {
    const payload: any = {
      company_name: workData.companyName,
      job_title: workData.role,
      date: `${workData.startDate} - ${workData.endDate}`
    };
 
    if (jobId) payload.job_id = jobId;
    if (userDescription) payload.user_description = userDescription;
    console.log("user desc from ai service",userDescription);
 
    return this.http.post<AIGenerateResponse>(`${this.baseUrl}/airesume/work_experience_description`, payload);
  }
 
  generateProjectDescription(projectData: any, jobId?: number, userDescription?: string): Observable<AIGenerateResponse> {
    const payload: any = {
      project_title: projectData.name,
      date: `${projectData.startDate} - ${projectData.endDate}`
    };
 
    if (jobId) payload.job_id = jobId;
    if (userDescription) payload.user_description = userDescription;
 
    return this.http.post<AIGenerateResponse>(`${this.baseUrl}/airesume/project_overview_description`, payload);
  }
 
  generateObjective(userId: number, jobTitle: string, jobId?: number, userDescription?: string): Observable<AIGenerateResponse> {
    const payload: any = {
      user_id: userId,
      job_title: jobTitle
    };
 
    if (jobId) payload.job_id = jobId;
    console.log("job id from airesume service",jobId)
    if (userDescription) payload.user_description = userDescription;
    console.log("user desc from ai service",userDescription);
 
    return this.http.post<AIGenerateResponse>(`${this.baseUrl}/airesume/resume_objective`, payload);
  }
 
}
