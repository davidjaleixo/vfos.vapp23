import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RmesService {
    constructor(private http: HttpClient) { }

    getByPar(parId: String) {
        return this.http.get(environment.apiUrl + '/rmes?par=' + parId);
    }
    create(parId: String, qtd: Number, status: Number, description: String) {        
        return this.http.post(environment.apiUrl + '/rmes', { par: parId, qtd: qtd, status: status , description: description });
    }
    getNewly() {
        return this.http.get(environment.apiUrl + '/rmes?newly=true');
    }
    updateStatus(rmeId: String, newStatus: Number, comment: String) {
        return this.http.patch(environment.apiUrl + '/rmes?id=' + rmeId, { status: newStatus, comment: comment })
    }
    getByProject(projectid: String){
        return this.http.get(environment.apiUrl + '/rmes?project='+projectid);
    }
}