import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ParsService {
    constructor(private http: HttpClient) { }
    create(projectId: String, description: String, materialid: String, qtd: Number) {
        return this.http.post(environment.apiUrl + '/pars', { project: projectId, description: description, materialid: materialid, qtd: qtd })
    }
    getByProject(projectId: String) {
        return this.http.get(environment.apiUrl + '/pars?project=' + projectId);
    }
    getNewly(projectId: String){
        return this.http.get(environment.apiUrl + '/pars?project=' + projectId + '&newly=true');
    }
    delete(parId: String) {
        return this.http.delete(environment.apiUrl + '/pars?id=' + parId)
    }
    getById(parId: String){
        return this.http.get(environment.apiUrl + '/pars?id=' + parId);
    }
}