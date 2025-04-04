import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class VideoService {
  // unsaveItem(id: any) {
  //   throw new Error('Method not implemented.');
  // }
  shareShort(shortId: number) {
    throw new Error('Method not implemented.');
  }
  addShortComment(shortId: number, comment: string) {
    throw new Error('Method not implemented.');
  }
 
 
  constructor(private http: HttpClient) { }
 
  getVideosByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/long-video/longVideos/${userId}`);
  }
  getAllSavedItems(userId: number): Observable<any> {
    console.log('Calling getAllSavedItems API for user:', userId);
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get(`${environment.apiBaseUrl}/savedItems/getAllSavedItems`, { params })
      .pipe(
        tap((response: any) => console.log('API response:', response)),
        catchError((error: any) => {
          console.error('API error:', error);
          return throwError(() => error);        })
      );
  }
  
  deleteVideo(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/long-video/delete/${id}`);
  }
  updateVideoDescription(id: number, description: string): Observable<any> {
    return this.http.put<any>(`${environment.apiBaseUrl}/long-video/update/${id}?longVideoDescription=${description}`, null);
  }
 
  getVideoLikeCount(videoId: number): Observable<number> {
    return this.http.get<number>(`${environment.apiBaseUrl}/long-video/${videoId}/like-count`);
  }
 
  getVideoShareCount(videoId: number): Observable<number> {
    return this.http.get<number>(`${environment.apiBaseUrl}/long-video/${videoId}/share-count`);
  }
 
  getVideoCommentCount(videoId: number): Observable<number> {
    return this.http.get<number>(`${environment.apiBaseUrl}/long-video/${videoId}/comment-count`);
  }
  likeVideo(videoId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/long-video/${videoId}/like`, {});
  }
 
  shareVideo(videoId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/long-video/${videoId}/share`, {});
  }
 
  addVideoComment(videoId: number, comment: string): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}/long-video/${videoId}/comment`, { text: comment });
  }
 ////shorts//////
 getShortsByUserId(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${environment.apiBaseUrl}/short-video/short-videos/getAll/${userId}`);
}
 
deleteShort(id: number): Observable<void> {
  return this.http.delete<void>(`${environment.apiBaseUrl}/short-video/delete/${id}`);
}
 
updateShortDescription(id: number, description: string): Observable<any> {
  return this.http.put<any>(`${environment.apiBaseUrl}/short-video/update/${id}?shortVideoDescription=${description}`, null);
}
 
getShortLikeCount(shortId: number): Observable<number> {
  return this.http.get<number>(`${environment.apiBaseUrl}/short-video/${shortId}/like-count`);
}
 
getShortShareCount(shortId: number): Observable<number> {
  return this.http.get<number>(`${environment.apiBaseUrl}/short-video/${shortId}/share-count`);
}
 
getShortCommentCount(shortId: number): Observable<number> {
  return this.http.get<number>(`${environment.apiBaseUrl}/short-video/${shortId}/comment-count`);
}
 
likeShort(shortId: number): Observable<void> {
  return this.http.post<void>(`${environment.apiBaseUrl}/short-video/${shortId}/like`, {});
}
 

 
 
}
 
 
 
 
 