import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ItemsService {
    constructor(private http: HttpClient) { }
    create(idpars: String, idmaterial: String, qtd: Number, name: String) {
        return this.http.post(environment.apiUrl + '/items', { parid: idpars, materialid: idmaterial, qtd: qtd, description: name })
    }
    getByPar(parid: String) {
        return this.http.get(environment.apiUrl + '/items?par=' + parid);
    }
    getByRme(rmeid: String){
        return this.http.get(environment.apiUrl + '/items?rme=' + rmeid);
    }
    delete(itemId: String) {
        return this.http.delete(environment.apiUrl + '/items?id=' + itemId);
    }
}