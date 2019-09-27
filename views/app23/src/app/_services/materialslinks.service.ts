import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MaterialLinksService {
    constructor(private http: HttpClient) { }
    create(materialid: String, description: String, link: String) {
        return this.http.post(environment.apiUrl + '/materialslinks', { material: materialid, description: description, link: link })
    }
    getByMaterialId(materialid: String) {
        return this.http.get(environment.apiUrl + '/materialslinks?material=' + materialid)
    }
    delete(id: String) {
        return this.http.delete(environment.apiUrl + '/materialslinks?id=' + id)
    }
}