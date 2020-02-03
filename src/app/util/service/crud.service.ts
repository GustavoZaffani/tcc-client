import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export abstract class CrudService<T, ID> {

  constructor(protected url: string, protected http: HttpClient) {
  }

  protected getUrl(): string {
    return this.url;
  }

  findAll(): Observable<T[]> {
    return this.http.get<T[]>(this.getUrl());
  }

  findOne(id: ID): Observable<T> {
    return this.http.get<T>(this.getUrl() + `find-one/${id}`);
  }

  save(t: T): Observable<T> {
    return this.http.post<T>(this.getUrl(), t);
  }

  delete(id: ID): Observable<void> {
    return this.http.delete<void>(`${this.getUrl()}/${id}`);
  }
}
