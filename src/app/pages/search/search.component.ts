import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private http: HttpClient) { }
  search;
  ngOnInit(): void {
    // this.http.get(`http://45.55.54.157/api/ad-list/?category=${americanCars}&search=${bmw}`).subscribe(search=>{
    //   this.search = search['results'];
    // })
  }

}
