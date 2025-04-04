import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class AimlservicecourserecService {
 
  private apiBaseUrl = environment.apiBaseUrl;
  handleError: any;
 
  constructor(private http: HttpClient) { }
 
//////////// course recommendatuins //////////////////
getHomeRecommendations(userId: number): Observable<any> {
 
  // ${this.apiBaseUrl}/homeRecommendations
  return this.http.post<any>(`http://localhost:8000/home_recommendations`, { user_id: userId });
}
 
 
}