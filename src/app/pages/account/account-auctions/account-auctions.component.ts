import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-auctions',
  templateUrl: './account-auctions.component.html',
  styleUrls: ['./account-auctions.component.css']
})
export class AccountAuctionsComponent implements OnInit {
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
