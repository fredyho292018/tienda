import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {RESTAPI} from '../config/rest-api';
import { Rol } from '../models/rol.enum';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = RESTAPI;
  login: Login = new Login();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  authenticate(login: any): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, JSON.stringify(login), this.httpOptions).pipe(map(item => {
      login.token = item.error === false ? item.token : null;

      login.id_usuario = item.id_usuario;
      login.rol_id = item.rol_id;
      localStorage.setItem('currentUser', JSON.stringify(login));
      return item;
    }));
  }

  register(login: any): Observable<any> {
    return this.http.post<any>(`${this.url}/login/registrar`, JSON.stringify(login), this.httpOptions).pipe(map(item => {
      return item;
    }));
  }

  isLoggedIn(): boolean {
    if(localStorage.getItem('currentUser') !== null){
      this.login = JSON.parse(localStorage.getItem('currentUser'));
      return this.login.token !== null;
    }
    return false;
  }

  isAdmin(): boolean {
    if(localStorage.getItem('currentUser') !== null){
      this.login = JSON.parse(localStorage.getItem('currentUser'));
      return this.login.rol_id == Rol.admin;
    }
    return false;
  }
  
  logout() {
    localStorage.removeItem('cart');
    localStorage.removeItem('currentUser');
    console.log(this.login);
    this.login = null;
    
  }
}
