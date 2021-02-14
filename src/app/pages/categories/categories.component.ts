import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router';
import { LanguagesService } from 'src/app/shared/services/languages/languages.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  category;
  governorates;
  id;
  urlSearch;
  subcategories;
  pageCount=12;
  search= {
    governorate:undefined,
    page:1
  };
  country=localStorage.getItem('country')

  categoryFilter({governorate}){
    if(governorate){
      this.search.governorate = governorate;
    }
    // return '?governorate='+(this.search.governorate ? this.search.governorate : '') + '&subcategory=' + (this.search.subcategory ? this.search.subcategory : '')


  }


  constructor(private http:HttpClient,public langService:LanguagesService, private _Activatedroute:ActivatedRoute) {}
  ngOnInit(): void {
    this._Activatedroute.params.subscribe(params=>{
      this.id=params["id"];
      this.search.governorate = this._Activatedroute.snapshot.queryParamMap.get("governorate") && this._Activatedroute.snapshot.queryParamMap.get("governorate").length > 0  ? this._Activatedroute.snapshot.queryParamMap.get("governorate") : undefined
      this.http.get(`http://45.55.54.157/api/category/${this.id}/ads`).subscribe( category => {
        this.category = category;
      });
      this.http.get(`http://45.55.54.157/api/category/${this.id}/sub-category`).subscribe( subcategories => {
        this.subcategories = subcategories;
      });

      this.http.get(`http://45.55.54.157/api/country/${this.country}/governorate`).subscribe(governorates => {
        this.governorates = governorates;
        console.log(governorates)
      });
    })
  }

}
