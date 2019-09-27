import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MaterialService {
    constructor(private http: HttpClient) { }
    create(materialName: String, projectid: String) {
        return this.http.post(environment.apiUrl + '/materials', { name: materialName, project: projectid })
    }
    getByProject(projectid: String){
        return this.http.get(environment.apiUrl + '/materials?project=' + projectid)
    }
    updateName(materialId: String, newName: String) {
        return this.http.patch(environment.apiUrl + '/materials?id=' + materialId, { name: newName })
    }
    delete(materialId: String) {
        return this.http.delete(environment.apiUrl + '/materials?id=' + materialId)
    }
}