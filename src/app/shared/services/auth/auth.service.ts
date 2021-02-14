import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    token = JSON.parse(localStorage.getItem('77carsalelogin'))
    canActivate(){
      console.log(this.token['access']);
      console.log(this.token['refresh']);
      console.log(this.token);
      console.log(this.token != undefined && this.token['access']&& this.token['refresh']);
      if(this.token != undefined && this.token['access']&& this.token['refresh']){
        console.log('succss');
        return true;
      } else {
        console.log('False');
        return false
      }
    }
  constructor(private http:HttpClient) { }
  ngOnInit(): void {


  }
}
