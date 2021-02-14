import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.css']
})
export class AuctionsComponent implements OnInit {
  token = localStorage.getItem("77carsalelogin");
  auctions;
  constructor(private http:HttpClient) { }
  ngOnInit(): void {
    this.http.get('http://45.55.54.157/api/auction/').subscribe(auctions => {
      this.auctions = auctions
    });
    
    
   
  }

}
