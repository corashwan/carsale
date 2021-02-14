import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LanguagesService } from 'src/app/shared/services/languages/languages.service';
import { FormGroup , FormControl, Validators} from '@angular/forms'
@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {
  hasAds;
  uploadedImages=[];
  imageChoosen=[];
  loading;
  countries;
  governorates;
  categories;
  subCategories;
  subSubCategories;
  years;
  carExterior;
  carEnterior;
  carStatus;
  carImport;
  submitAdForm(){
    this.adForm.value.images = this.uploadedImages;
    console.log(this.adForm)
  }
  submitAdImages(){
    this.loading = true;
    const fd = new  FormData();
    fd.append("image",this.imageChoosen[0]);
    this.http.post('http://45.55.54.157/api/ad-image/',fd,{
      headers:{
        Authorization: 'Bearer ' +JSON.parse(localStorage.getItem('77carsalelogin'))['access']
      }
  }).subscribe(image => {
      image["is_cover"]=false
      this.uploadedImages.push(image);
      this.loading = false;
    }, error =>{
      console.log(error)
    })
  }


  constructor(
    public LangService:LanguagesService,
    private http: HttpClient
  ) { }
  onChangeInputFile(event){
    this.imageChoosen = event.target.files;
    console.log(this.imageChoosen)
    console.log(this.adImages)
  }

  ngOnInit(): void {
    // this.http.get('http://45.55.54.157/api/ads/has_ads/', {
    //   headers:{
    //     Authorization: 'Bearer ' +JSON.parse(localStorage.getItem('77carsalelogin'))['access']
    //   }
    // }).subscribe(hasAds=>{
    //   this.hasAds = hasAds['results'];
    //   console.log('has ads: ' + hasAds)
    // })
    this.http.get('http://45.55.54.157/api/country/').subscribe(countries=>{
      this.countries = countries['results'];
    })
    this.http.get('http://45.55.54.157/api/country/').subscribe(countries=>{
      this.countries = countries['results'];
    })
    this.http.get('http://45.55.54.157/api/category/').subscribe(categories=>{
      this.categories = categories['results'];
    })
    this.http.get('http://45.55.54.157/api/car-year/').subscribe( years =>{
      this.years = years['results'];
    })
    this.http.get('http://45.55.54.157/api/car-exterior/').subscribe( carExterior =>{
      this.carExterior = carExterior['results'];
    })
    this.http.get('http://45.55.54.157/api/car-enterior/').subscribe( carEnterior =>{
      this.carEnterior = carEnterior['results'];
    })
    this.http.get('http://45.55.54.157/api/car-status/').subscribe( carStatus =>{
      this.carStatus = carStatus['results'];
    })
    this.http.get('http://45.55.54.157/api/car-import/').subscribe( carImport =>{
      this.carImport = carImport['results'];
    })
  }
  getGovernorates(){
    this.http.get(`http://45.55.54.157/api/country/${this.country.value}/governorate/`).subscribe(governorates=>{
      this.governorates = governorates;
    })
    console.log('country: ' + this.country.value)
  }
  getSubcategory(){
    this.http.get(`http://45.55.54.157/api/category/${this.category.value}/sub-category/`).subscribe(subCategories=>{
      this.subCategories = subCategories['results'];
    })
  }
  getSubSubCategory(){
    this.http.get(`http://45.55.54.157/api/category/${this.category.value}/sub-category/${this.subcategory.value}/sub-subcategory/`).subscribe(subSubCategories=>{
      this.subSubCategories = subSubCategories;
    })
  }
  adImages = new FormGroup({
    image: new FormControl('',[Validators.required]),
   
  })
  adForm = new FormGroup({
    images: new FormControl([],[Validators.required]),
    title: new FormControl('',Validators.required),
    phone: new FormControl('',[
      Validators.required,
      Validators.maxLength(11),
      Validators.maxLength(11),
    ]),
    country: new FormControl('',Validators.required),
    governorate: new FormControl('',Validators.required),
    category: new FormControl('',Validators.required),
    subcategory: new FormControl('',Validators.required),
    sub_subcategory: new FormControl('',Validators.required),
    mileage: new FormControl('',Validators.required),
    year: new FormControl('',Validators.required),
    color_exterior: new FormControl('',Validators.required),
    color_interior: new FormControl('',Validators.required),
    car_status: new FormControl('',Validators.required),
    car_import: new FormControl('',Validators.required),
    price: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required),
    paid_featured: new FormControl('',Validators.required),
    payment_method: new FormControl('',Validators.required),
    longitude: new FormControl('',Validators.required),
    latitude: new FormControl('',Validators.required),
   
  })
    get title(){ return this.adForm.get("title")};
    get phone(){return this.adForm.get("phone")};
    get country(){ return this.adForm.get("country")};
    get governorate(){ return this.adForm.get("governorate")};
    get category(){ return this.adForm.get("category")};
    get subcategory(){ return this.adForm.get("subcategory")};
    get sub_subcategory(){ return this.adForm.get("sub_subcategory")};
    get mileage(){ return this.adForm.get("mileage")};
    get year(){ return this.adForm.get("year")};
    get color_exterior(){ return this.adForm.get("color_exterior")};
    get color_interior(){ return this.adForm.get("color_interior")};
    get car_status(){ return this.adForm.get("car_status")};
    get car_import(){ return this.adForm.get("car_import")};
    get price(){ return this.adForm.get("price")};
    get description(){ return this.adForm.get("description")};
    get paid_featured(){ return this.adForm.get("paid_featured")};
    get payment_method(){ return this.adForm.get("payment_method")};
    get longitude(){ return this.adForm.get("longitude")};
    get latitude(){ return this.adForm.get("latitude")};
}
