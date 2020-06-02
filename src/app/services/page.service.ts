import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private http: HttpClient) { }
  get(slug) {
    return this.http.get<any>(`/site/${slug}`)
      .pipe(map(result => {
        return result;
      }));
  }
}
