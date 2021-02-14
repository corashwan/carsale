import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-recent-ads',
  templateUrl: './recent-ads.component.html',
  styleUrls: ['./recent-ads.component.css']
})
export class RecentAdsComponent implements OnInit {
  api;
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://45.55.54.157/api/ads/recent-ads/').subscribe( res => {
      this.api = res
    })
  }

}
