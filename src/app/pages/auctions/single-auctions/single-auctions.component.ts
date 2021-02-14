import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-auctions',
  templateUrl: './single-auctions.component.html',
  styleUrls: ['./single-auctions.component.css']
})
export class SingleAuctionsComponent implements OnInit {
  token = localStorage.getItem("77carsalelogin");
  auction;
  similar;
  id;
  constructor(private http:HttpClient, private _Activatedroute:ActivatedRoute) { }
  ngOnInit(): void {
    this._Activatedroute.params.subscribe(params=> {
      this.id=params["id"];
    });
    this.http.get(`http://45.55.54.157/api/auction/${this.id}`).subscribe(auction => {
      this.auction = auction;

    });
    this.http.get(`http://45.55.54.157/api/auction/${this.id}/similar-auctions/`).subscribe(similar => {
      this.similar = similar;

    });
    
  }

}
