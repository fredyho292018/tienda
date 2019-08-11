import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { RESTAPI } from '../config/rest-api';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  url: string = RESTAPI + '/pedidos';

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  addOrden(token: string, idUsuario: string, idProductos: string[]): Observable<any> {
    let strItems = '';
    for (let index = 0; index < idProductos.length; index++) {
      if (index === idProductos.length - 1) {
        strItems += idProductos[index];
      } else {
        strItems += idProductos[index] + ',';
      }
    }
    const datos = new HttpParams().append('items', strItems);
    return this.http.post<any>(`${this.url}/realizar_orden/${token}/${idUsuario}`, datos);
  }

  getOrdenes() {

  }
}
