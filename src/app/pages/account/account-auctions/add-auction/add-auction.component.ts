import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LanguagesService } from 'src/app/shared/services/languages/languages.service';
import { FormGroup , FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-auction',
  templateUrl: './add-auction.component.html',
  styleUrls: ['./add-auction.component.css']
})
export class AddAuctionComponent implements OnInit {
  auction;
  uploadImages=[];
  loading;
  imageChoosen = [];
  countries;
  years;
  carExterior;
  carEnterior;
  carStatus;
  carImport;
 
  submitAdAuctionForm() {
    if(this.adAuctionForm.status !=="INVALID" ) {
      const fData = new FormData();
      fData.append('title', this.auction.title)
      fData.append('phone', this.auction.phone)
      fData.append('country', this.auction.country)
      fData.append('mileage', this.auction.mileage)
      fData.append('year', this.auction.year)
      fData.append('color_exterior', this.auction.color_exterior)
      fData.append('color_interior', this.auction.color_interior)
      fData.append('car_status', this.auction.car_status)
      fData.append('car_import', this.auction.car_import)
      fData.append('examine_status', this.auction.examine_status)
      fData.append('description', this.auction.description)
      // if(this.imageChoosen.length) {
      //   for(var i=0; i<this.imageChoosen.length; i++) {
      //     fData
      //   }
      // }

      this.http.post('http://45.55.54.157/api/auction',fData,{
      headers:{
        Authorization: 'Bearer ' +JSON.parse(localStorage.getItem('77carsalelogin'))['access']
      }
    }).subscribe(auction => {
      this.auction = auction;
      console.log('auction:'+auction)
    }, error => {
      console.log('auction:'+error)
    })

    }
    // this.adAuctionForm.value.images = this.uploadImages;
    // console.log('adAuctionForm:'+this.adAuctionForm)
    
    console.log('adAuctionForm:'+this.adAuctionForm);
  }
  submitAdAuctionImages() {
    this.loading = true;
    const fileUpload = new FormData();
    fileUpload.append("image", this.imageChoosen[0]);
    this.http.post('http://45.55.54.157/api/auction-image/',fileUpload,{
      headers:{
        Authorization: 'Bearer ' +JSON.parse(localStorage.getItem('77carsalelogin'))['access']
      }
    }).subscribe(image => {
      image['is_cover'] = false
      this.uploadImages.push(image)
      this.loading = false
    }, error => {
      console.log('uploadedImages:'+error)
    })
  }

  

  constructor(private http: HttpClient, public LangService:LanguagesService,) { }

  onChangeInputFile(event){
    this.imageChoosen = event.target.files;
    console.log('imageChoosen:'+this.imageChoosen)
    console.log('uploadImages:'+this.uploadImages)
  }

  ngOnInit(): void {
    this.http.get('http://45.55.54.157/api/country/').subscribe( countries =>{
      this.countries = countries['results'];
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

  adImages = new FormGroup({
    image: new FormControl('', [Validators.required])
  })

  adAuctionForm = new FormGroup({
    images: new FormControl([], [Validators.required]),
    title: new FormControl('', [Validators.required]),
    phone: new FormControl('',[
      Validators.required,
      Validators.maxLength(11),
      Validators.maxLength(11),
    ]),
    country: new FormControl('',Validators.required),
    mileage: new FormControl('',Validators.required),
    year: new FormControl('',Validators.required),
    color_exterior: new FormControl('',Validators.required),
    color_interior: new FormControl('',Validators.required),
    car_status: new FormControl('',Validators.required),
    car_import: new FormControl('',Validators.required),
    examine_status: new FormControl('',Validators.required),
    description: new FormControl(''),
  })

  get title(){ return this.adAuctionForm.get('title')};
  get phone(){return this.adAuctionForm.get("phone")};
  get country(){ return this.adAuctionForm.get("country")};
  get mileage(){ return this.adAuctionForm.get("mileage")};
  get year(){ return this.adAuctionForm.get("year")};
  get color_exterior(){ return this.adAuctionForm.get("color_exterior")};
  get color_interior(){ return this.adAuctionForm.get("color_interior")};
  get car_status(){ return this.adAuctionForm.get("car_status")};
  get car_import(){ return this.adAuctionForm.get("car_import")};
  get examine_status(){ return this.adAuctionForm.get("examine_status")};
  get description(){ return this.adAuctionForm.get("description")};


}
