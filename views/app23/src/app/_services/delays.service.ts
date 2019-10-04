import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DelayService {
    constructor(private http: HttpClient) { }
    create(description: String, impactlevel: String, taskid: Number, impactdays: Number) {
        return this.http.post(environment.apiUrl + '/delays', { description: description, task: taskid, level: impactlevel, days: impactdays })
    }
    getAll(projectId) {
        return this.http.get(environment.apiUrl + '/delays?project=' + projectId)
    }
    getByTask(taskid) {
        return this.http.get(environment.apiUrl + '/delays?task=' + taskid)
    }
    getById(id) {
        return this.http.get(environment.apiUrl + '/delays?id=' + id)
    }
    accept(id, status: boolean) {
        return this.http.put(environment.apiUrl + '/delays?id=' + id, { accept: status })
    }
}