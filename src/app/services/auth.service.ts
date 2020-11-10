import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

 
const authMethod = 'http://sp4.wavea.cc/carstenfries/Auth/';
 

const httpOptions = { 
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials): Observable<any> {
    return this.http.post(authMethod + 'token', {
      email: credentials.email,
      password: credentials.password
    }, httpOptions);
  }

  changePassword(password,newpassword): Observable<any> {
    return this.http.post(authMethod + 'password',
    {
      password: "string",
      newPassword: "string"
    }, httpOptions);
  }

  getUserInfo(): Observable<User> {
    return this.http.get<User>(authMethod + 'me', httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(authMethod + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    }, httpOptions);
  }
}
