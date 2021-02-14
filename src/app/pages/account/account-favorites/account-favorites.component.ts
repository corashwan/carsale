import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-favorites',
  templateUrl: './account-favorites.component.html',
  styleUrls: ['./account-favorites.component.css']
})
export class AccountFavoritesComponent implements OnInit {
  user;
  wishList; 


  constructor(private http:HttpClient) { }
  ngOnInit(): void {
    this.http.get('http://45.55.54.157/api/accounts/profile/',{
        headers:{
          Authorization:'Bearer ' +JSON.parse(localStorage.getItem('77carsalelogin'))['access']
        }
      }).subscribe( user => {
        this.user = user
        console.log(this.user);
      }, error =>{
        console.log(error)
      });
    this.http.get('http://45.55.54.157/api/accounts/wishlist/',{
        headers:{
          Authorization:'Bearer ' +JSON.parse(localStorage.getItem('77carsalelogin'))['access']
        }
      }).subscribe( wishList => {
        this.wishList = wishList
        console.log(this.wishList);
      }, error =>{
        console.log(error)
      });

  }

}
