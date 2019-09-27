import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReceivedService {
    
    constructor(private http: HttpClient) { }

    create(idlist: String, idrme: String, qtd: Number) {
        return this.http.post(environment.apiUrl + '/receiveds', { listid: idlist, rmeid: idrme, qtd: qtd })
    }
    getByRme(rmeid: String) {
        return this.http.get(environment.apiUrl + '/receiveds?rme=' + rmeid);
    }
    getById(receivedid: String) {
        return this.http.get(environment.apiUrl + '/receiveds?id=' + receivedid);
    }
    delete(receivedid: String) {
        return this.http.delete(environment.apiUrl + '/receiveds?id=' + receivedid);
    }
}