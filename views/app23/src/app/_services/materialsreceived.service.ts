import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MaterialReceivedService {
    constructor(private http: HttpClient) { }
    
    getAllByProject(projectid) {
        return this.http.get(environment.apiUrl + '/materialsreceived?projectid=' + projectid);
    }
}