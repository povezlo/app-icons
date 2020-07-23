import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Icon} from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class WorkWithFirebaseIconsService {

    constructor(private http: HttpClient) {
    }

    create(icon: Icon): Observable<Icon> {
        return this.http.post(`${environment.firebaseDataBase}/icons.json`, icon)
            .pipe(map((response: any) => {
                return {
                    ...icon,
                    id: response.name
                }
            }));
    }

    getAll(): Observable<Icon[]> {
        return this.http.get(`${environment.firebaseDataBase}/icons.json`)
            .pipe(map((response: { [key: string]: any }) => {
                return Object
                    .keys(response)
                    .map(key => ({
                        ...response[key],
                        id: key
                    }));
            }));
    }

    remove(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.firebaseDataBase}/icons/${id}.json`);

    }

    patch(id: string, objChanged?: any): Observable<any> {
        return this.http.patch(`${environment.firebaseDataBase}/icons/${id}.json`, objChanged);
    }

    getById(id: string): Observable<Icon> {
        return this.http.get<Icon>(`${environment.firebaseDataBase}/icons/${id}.json`);
    }

}
