import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-featured-ads',
  templateUrl: './featured-ads.component.html',
  styleUrls: ['./featured-ads.component.css']
})
export class FeaturedAdsComponent implements OnInit {
  api;
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://45.55.54.157/api/ads/featured-ads/').subscribe( res => {
      this.api = res;
    })
  }

}
