import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ParsLinksService {
    constructor(private http: HttpClient) { }
    
    create(parid: String, description: String, link: String) {
        return this.http.post(environment.apiUrl + '/parslinks', { par: parid, description: description, link: link })
    }
    getByParId(parid: String) {
        return this.http.get(environment.apiUrl + '/parslinks?par=' + parid)
    }
    delete(id: String) {
        return this.http.delete(environment.apiUrl + '/parslinks?id=' + id)
    }
}