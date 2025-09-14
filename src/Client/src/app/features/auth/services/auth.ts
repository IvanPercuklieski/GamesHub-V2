import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Storage } from 'src/app/core/services/storage';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  http = inject(HttpClient)
  storage = inject(Storage)
  private apiUrl = 'https://localhost:7220/api/Users'

  login(username: string, password: string){
    return this.http.post(`${this.apiUrl}/login`, {usernameOrEmail: username, password})
  }

  register(username: string, email: string, password: string){
    return this.http.post(`${this.apiUrl}/register`, {username, email, password})
  }

  isAuthenticated(){
    return !!this.storage.get('user')
  }

  logout(){
    this.storage.remove("user")
  }
}
