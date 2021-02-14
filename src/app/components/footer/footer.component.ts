import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  categories;
  social;
  constructor(private http:HttpClient) { }
  ngOnInit(): void {
    this.http.get('http://45.55.54.157/api/category').subscribe( categories => {

      this.categories = categories["results"]
    });
    this.http.get('http://45.55.54.157/api/social-contacts/').subscribe( social => {

      this.social = social;
      console.log(social)
    });

  }

}
