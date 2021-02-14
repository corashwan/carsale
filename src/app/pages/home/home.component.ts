import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LanguagesService } from 'src/app/shared/services/languages/languages.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  api;
  constructor(private http:HttpClient, public langService:LanguagesService) { }

  ngOnInit(): void {
    this.http.get('https://jsonplaceholder.typicode.com/photos').subscribe(res=>{
      this.api = res
    })
  }

}
