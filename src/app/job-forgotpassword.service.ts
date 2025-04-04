import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root',
})
export class JobForgotpasswordService {
  private baseUrl = 'http://localhost:8080/jobAdmin/generate-otp'; // Backend URL
 
  constructor(private http: HttpClient) {}
 
  /**
   * Sends an OTP to the given JobAdmin email address.
   * @param jobAdminEmail - The email address to which the OTP will be sent.
   * @returns Observable<string> - Emits a success message from the backend.
   */
  sendOtp(jobAdminEmail: string): Observable<string> {
    const params = new HttpParams().set('jobAdminEmail', jobAdminEmail);
 
    return this.http.post(this.baseUrl, null, {
      params,
      responseType: 'text', // Expect plain text response
    });
  }
}