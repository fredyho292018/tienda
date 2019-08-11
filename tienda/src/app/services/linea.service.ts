import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Linea} from '../models/linea';
import {RESTAPI} from '../config/rest-api';

@Injectable({
  providedIn: 'root'
})
export class LineaService {
  url: string = RESTAPI + '/lineas';

  constructor(private http: HttpClient) {
  }

  getLineas(): Observable<Linea[]> {
    return this.http.get<Linea[]>(this.url);
  }
}


