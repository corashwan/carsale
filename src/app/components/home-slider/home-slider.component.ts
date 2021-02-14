import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.css']
})
export class HomeSliderComponent implements OnInit {
  api;

  constructor(private http:HttpClient) {  }

  ngOnInit(): void {
    this.http.get('http://45.55.54.157/api/slide-ads/').subscribe( res => {
      this.api = res["results"]
    })
  }

}
