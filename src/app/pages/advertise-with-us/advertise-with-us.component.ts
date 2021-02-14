import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-advertise-with-us',
  templateUrl: './advertise-with-us.component.html',
  styleUrls: ['./advertise-with-us.component.css']
})
export class AdvertiseWithUsComponent implements OnInit {
  pageAdv;
  constructor(private http:HttpClient,) { }

  ngOnInit(): void {
    this.http.get('http://45.55.54.157/api/advertise-with-us').subscribe(pageAdv => {
      this.pageAdv = pageAdv
    });
  }

}
