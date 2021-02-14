import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LanguagesService } from 'src/app/shared/services/languages/languages.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
  styleUrls: ['./product-information.component.css']
})
export class ProductInformationComponent implements OnInit {
  product;
  constructor(private http:HttpClient, private _Activatedroute:ActivatedRoute ,public _location: Location, public langService:LanguagesService) { }

  ngOnInit(): void {
    this._Activatedroute.params.subscribe(params => {
      this.http.get(`http://45.55.54.157/api/ads/${params["id"]}/`).subscribe(product=>{
        this.product = product;
        console.log(product)
      })
    })
  }

}
