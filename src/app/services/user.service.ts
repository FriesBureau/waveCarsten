import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user.model'

 
const userMethod = 'http://sp4.wavea.cc/carstenfries/Users/';
 

const httpOptions = { 
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // Photos

  getPhotos(userId,index): Observable<any> {
    return this.http.get(userMethod + '/Users/' + {userId} + '/Photos/' + {index}, { responseType: 'text' });
  }

   postPhotos(userId,index): Observable<any> {
    return this.http.post(userMethod + userId + '/Photos/' + index,
    {
      "additionalProp1": [
        "string"
      ],
      "additionalProp2": [
        "string"
      ],
      "additionalProp3": [
        "string"
      ]
    });
  }

  deletePhotos(userId,index): Observable<any> {
    return this.http.delete(userMethod + '/Users/' + {userId} + '/Photos/' + {index}, { responseType: 'text' });
  }

  // Users  

  getUsers(page,pageSize): Observable<any> {
    return this.http.get<adminApi>(userMethod + `?page=${page}&Size=${pageSize}`);
  }

  searchUsers(page,pageSize, searchQuery): Observable<any> {
    return this.http.get<adminApi>(userMethod + `?page=${page}&Size=${pageSize}&search=${searchQuery}`);
  }

  createUser(userdata): Observable<any> {
      return this.http.post(userMethod, {
      id: 0,
      firstName: userdata.firstName,
      lastName: userdata.lastName,
      email: userdata.email,
      password: userdata.password,
      phone: userdata.phone,
      role: userdata.role,
     // photoCount: userdata.photos.length
    }, httpOptions); 
  }

  getUserById(userid): Observable<any> {
    return this.http.get(userMethod + userid);
  }

  updateUserById(id,userdata): Observable<any> {
    console.log('service userdata',userdata);
    return this.http.put(userMethod + id, {
      id: id,
      firstName: userdata.firstName,
      lastName: userdata.lastName,
      phone: userdata.phone,
      role: 3
    });
  }

  deleteUserById(id): Observable<any> {
    return this.http.delete(userMethod + id);
  }

 
 
}




export interface adminApi {
  items: User[];
  total: number;
 }

 