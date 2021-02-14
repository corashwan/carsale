import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  privacyPolicy;
  constructor(private http:HttpClient,) { }

  ngOnInit(): void {
    this.http.get('http://45.55.54.157/api/advertise-with-us').subscribe(privacyPolicy => {
      this.privacyPolicy = privacyPolicy
    });
  }

}
