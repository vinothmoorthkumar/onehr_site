import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private http: HttpClient) { }
  get() {
    return this.http.get<any>(`/site/about_us`)
      .pipe(map(result => {
        return result;
      }));
  }
}
