import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  about;
  constructor(private http:HttpClient,) { }

  ngOnInit(): void {
    this.http.get('http://45.55.54.157/api/advertise-with-us').subscribe(about => {
      this.about = about
    });
  }

}
