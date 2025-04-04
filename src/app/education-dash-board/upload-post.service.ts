
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UploadPostService {

  constructor(private http: HttpClient) { }

  uploadShortVideo(userId: number, file: File | null, shortVideoDescription: string,tag:string,title:string): Observable<any> {
    if (!file) {
      alert("Please select a file");
      return throwError(() => new Error('Invalid input'));
    }
    else{
    const formData: FormData = new FormData();
    formData.append('file', file, title);
    formData.append('shortVideoDescription', shortVideoDescription);
    formData.append('tag', tag);

    formData.append('userId', userId.toString());
 
 
    return this.http.post(`http://localhost:8080/short-video/upload/${userId}`, formData);
    }
  }

  createArticlePost(userId: number, content: string): Observable<any> {
    const params = { userId, article: content };
    return this.http.post(`http://localhost:8080/api/articleposts/create`, null, { params });
  }

  createImagePost(userId: number, file: File | null, description: string,tag:string): Observable<any> {
    if (!file) {
      alert("Please select a file");
      return throwError(() => new Error('Invalid input'));
    }
    const formData: FormData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('photo', file, file.name);
    formData.append('imageDescription', description);
    formData.append('tag', tag);

    return this.http.post(`http://localhost:8080/api/imagePosts/create`, formData);
  }

  uploadLongVideo(userId: number, file: File | null, description: string,tag:string,title:string): Observable<any> {
    if (!file) {
      alert("Please select a file");
      return throwError(() => new Error('Invalid input'));
    }
    const formData: FormData = new FormData();
    formData.append('file', file, title);
    formData.append('longVideoDescription', description);
    formData.append('tag', tag);

    formData.append('userId', userId.toString());
 
    return this.http.post(`http://localhost:8080/long-video/upload/${userId}`, formData, { responseType: 'text' });
  }

  categrisedata(userId: number, description: string,tag:string,id:number,Type:string): Observable<any> {
    const body = 
    { "id": id,
      "content": description,
      "tag": tag,
      "type": Type,
      "user_id": userId}
 
    return this.http.post(`http://localhost:8000/feed_category/categorize-and-insert`, body);
  }

}
