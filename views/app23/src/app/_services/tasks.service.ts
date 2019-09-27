import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
    constructor(private http: HttpClient) { }
    create(taskName: String, projectId: String, dependecy: Number, startDate: Date, endDate: Date) {
        return this.http.post(environment.apiUrl + '/tasks', { name: taskName, project: projectId, sdate: startDate, edate: endDate, place: dependecy })
    }
    getAll(projectId) {
        return this.http.get(environment.apiUrl + '/tasks?project=' + projectId)
    }
}