import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import {RESTAPI} from '../config/rest-api';
import {Producto} from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  url: string = RESTAPI + '/productos';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  getProductos(pagina:number): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url+'/todos/'+pagina);
  }

  getProductoPorLinea(lineaId: number,pagina): Observable<any> {
    return this.http.get<Producto[]>(this.url+'/por_tipo/'+lineaId+'/'+pagina);
  }

  buscarProducto(termino: string): Observable<any> {
    return this.http.get<Producto[]>(`${this.url}/buscar/${termino}`);
  }

  addOrUpdate(producto: any): Observable<any> {
    return this.http.post<any>(`${this.url}/adicionar_o_actualizar/`, producto, this.httpOptions);
  }
  foto(datos: any): Observable<any> {
   // return this.http.post<any>(`${this.url}/guardarimagen/`, datos);
    return this.http.post<any>(this.url+'/foto', datos);
  }

  eliminarProducto(codigo: string): Observable<any> {
    const datos = new HttpParams().append('codigo', codigo);
    return this.http.post<any>(`${this.url}/eliminar/`, datos);
  }
}
