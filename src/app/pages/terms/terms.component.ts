import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  terms;
  constructor(private http:HttpClient,) { }

  ngOnInit(): void {
    this.http.get('http://45.55.54.157/api/advertise-with-us').subscribe(terms => {
      this.terms = terms
    });
  }

}
