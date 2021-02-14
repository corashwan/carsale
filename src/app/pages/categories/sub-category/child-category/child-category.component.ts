import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-child-Category',
  templateUrl: './child-Category.component.html',
  styleUrls: ['./child-Category.component.css']
})
export class ChildCategoryComponent implements OnInit {

  categoryId;
  subcategoryId;
  sub_subcategoryId;
  category;
  subcategory;
  sub_subcategory;
  governorates;
  urlSearch;
  subcategories;
  sub_subcategories;
  products;
  pageCount=12;
  search= {
    governorate:undefined,
    page:1
  };
  country=localStorage.getItem('country')
  constructor(private http:HttpClient, private _Activatedroute:ActivatedRoute) { }
  ngOnInit(): void {
    this._Activatedroute.params.subscribe(params=>{
      this.categoryId=params["categoryId"];
      this.subcategoryId=params["subcategoryId"];
      this.sub_subcategoryId=params["sub_subcategoryId"];
      this.search.governorate = this._Activatedroute.snapshot.queryParamMap.get("governorate") && this._Activatedroute.snapshot.queryParamMap.get("governorate").length > 0  ? this._Activatedroute.snapshot.queryParamMap.get("governorate") : undefined
      this.http.get(`http://45.55.54.157/api/category/${this.categoryId}/ads`).subscribe( category => {
        this.category = category;
      });
      this.http.get(`http://45.55.54.157/api/category/${this.categoryId}/sub-category/${this.subcategoryId}`).subscribe( subcategory => {
        this.subcategory = subcategory;
      });
      this.http.get(`http://45.55.54.157/api/category/${this.categoryId}/sub-category/${this.subcategoryId}/sub-subcategory/${this.sub_subcategoryId}`).subscribe( sub_subcategory => {
        this.sub_subcategory = sub_subcategory;
      });
      this.http.get(`http://45.55.54.157/api/category/${this.categoryId}/sub-category/${this.subcategoryId}/sub-subcategory/${this.sub_subcategoryId}/ads`).subscribe( products => {
        this.products = products;
        console.log(products)
      });
      this.http.get(`http://45.55.54.157/api/country/${this.country}/governorate`).subscribe(governorates => {
        this.governorates = governorates;
      });
    });
  }


}
