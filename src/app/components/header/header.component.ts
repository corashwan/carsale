import { Component, ElementRef , ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {LanguagesService} from '../../shared/services/languages/languages.service'
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { error } from '@angular/compiler/src/util';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('inputCode1') inputCode1: ElementRef;
  @ViewChild('inputCode2') inputCode2: ElementRef;
  @ViewChild('inputCode3') inputCode3: ElementRef;
  @ViewChild('inputCode4') inputCode4: ElementRef;
  @ViewChild('inputCode5') inputCode5: ElementRef;
  @ViewChild('inputCode6') inputCode6: ElementRef;
  @ViewChild('loginModel') loginModel: ElementRef;

  selected_prefix="965" ;
  sendOtpSubmitError;
  verifyOtpSubmitError;
  verifyOtpStatus=false;
  country;
  categories;
  showMore = false;
  countries;
  categorySearch;
  token=localStorage.getItem('77carsalelogin');
  focusToNextInput(index){
    if(index<6){
      this['inputCode'+(index+1)].nativeElement.focus();
    }
  }
  submitSendOtp(){
    if(this.sendOtp.status !== 'INVALID'){
      this.http.post('http://45.55.54.157/api/accounts/send-otp/',{
          phone:"0123456789",
          // phone:this.selected_prefix+this.phone.value,
          device:'DESKTOP'
        }).subscribe( res => {
          // Run Code After Finish Test
          // if(res["success"] != "Failed to sent."){
          //   this.verifyOtpStatus = true;
          //   console.log(res);
          // this.sendOtpSubmitError=''
          // } else {
          //   this.verifyOtpStatus = false;
          //   this.sendOtpSubmitError = res["success"]
          // }
          this.verifyOtpStatus = true;
           console.log(res);
        },
        error => {
          if(error.status == 400){
            this.verifyOtpStatus = false;
            this.sendOtpSubmitError = error.error.error.phone[0]
          }
        })

    }

    console.log(this.sendOtp)
  }
  submitVerifyOtp(){
    if(this.verifyOtp.status !== 'INVALID'){
      this.http.post('http://45.55.54.157/api/accounts/verify-otp/',{
          phone:"0123456789",
          // phone:this.selected_prefix+this.sendOtp.get('phone').value,
          otp:this.code1.value+this.code2.value+this.code3.value+this.code4.value+this.code5.value+this.code6.value
        }).subscribe( res => {
          this.verifyOtpSubmitError='';
            localStorage.setItem('77carsalelogin',JSON.stringify(res));
            this.router.navigate(['/account']);
            this.loginModel.nativeElement.click()
            // console.log(res);
            console.log(this.selected_prefix+this.sendOtp.get('phone').value);
            console.log(this.code1.value+this.code2.value+this.code3.value+this.code4.value+this.code5.value+this.code6.value);
        },
        error => {
          console.log(error)
          if(error.status == 400){
            if(error.error.error.otp){

              this.verifyOtpSubmitError = error.error.error.otp[0];
            } else {
              this.verifyOtpSubmitError = error.error.error
            }
            console.log(error)
          }
        })


        // console.log(this.sendOtp)
    }

    console.log(this.verifyOtp)

    console.log(this.selected_prefix+this.sendOtp.get('phone').value);
    console.log(this.code1.value+this.code2.value+this.code3.value+this.code4.value+this.code5.value+this.code6.value);
  }
  reSendOtp(){
    if(this.verifyOtp.status !== 'INVALID'){
      this.http.post('http://45.55.54.157/api/accounts/verify-otp/',{
          phone:"0123456789",
          // phone:this.selected_prefix+this.sendOtp.get('phone').value,
          otp:this.code1.value+this.code2.value+this.code3.value+this.code4.value+this.code5.value+this.code6.value
        }).subscribe( res => {
          this.verifyOtpSubmitError='';
            localStorage.setItem('77carsalelogin',JSON.stringify(res))
            // console.log(res);
            console.log(this.selected_prefix+this.sendOtp.get('phone').value);
            console.log(this.code1.value+this.code2.value+this.code3.value+this.code4.value+this.code5.value+this.code6.value);
        },
        error => {
          console.log(error)
          if(error.status == 400){
            if(error.error.error.otp){

              this.verifyOtpSubmitError = error.error.error.otp[0];
            } else {
              this.verifyOtpSubmitError = error.error.error
            }
            console.log(error)
          }
        })


        // console.log(this.sendOtp)
    }
  }
  change_language(){
    var lang = localStorage.getItem('lang');
    if(!lang || lang == 'ar'){
      localStorage.setItem('lang','en');
      this.langService.setLanguage('en')
    } else {
      localStorage.setItem('lang','ar');
      this.langService.setLanguage('ar')
    };


  }
  change_country(country){
    this.country = country
    localStorage.setItem('country',this.country)
  }
  constructor(
    private http:HttpClient,
    public langService:LanguagesService,
    private route:ActivatedRoute,
    private router: Router
    ) { }
  ngOnInit(): void {

    this.http.get('http://45.55.54.157/api/category-detail/').subscribe( categories => {
      this.categories = categories["results"]
    });

    this.http.get('http://45.55.54.157/api/country').subscribe(countries => {
      this.countries = countries["results"];
      console.log(countries)
    });

  }
  search(){
    console.log('category' + this.categorySearch)
    console.log(this.keywords)
    this.router.navigate(['/search', this.categorySearch, this.keywords]);
  }

  // Form

  searchForm = new FormGroup({
    keywords: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ])
  })
  sendOtp = new FormGroup({
      phone: new FormControl('',[
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(8)
      ])
  })
  verifyOtp = new FormGroup({
      code1: new FormControl('',[
        Validators.required,
        Validators.maxLength(1),
        Validators.minLength(1),
        Validators.pattern('[0-9]')
      ]),
      code2: new FormControl('',[
        Validators.required,
        Validators.maxLength(1),
        Validators.minLength(1),
        Validators.pattern('[0-9]')
      ]),
      code3: new FormControl('',[
        Validators.required,
        Validators.maxLength(1),
        Validators.minLength(1),
        Validators.pattern('[0-9]')
      ]),
      code4: new FormControl('',[
        Validators.required,
        Validators.maxLength(1),
        Validators.minLength(1),
        Validators.pattern('[0-9]')
      ]),
      code5: new FormControl('',[
        Validators.required,
        Validators.maxLength(1),
        Validators.minLength(1),
        Validators.pattern('[0-9]')
      ]),
      code6: new FormControl('',[
        Validators.required,
        Validators.maxLength(1),
        Validators.minLength(1),
        Validators.pattern('[0-9]')
      ])
  })
  get phone(){ return this.sendOtp.get('phone') }
  get code1(){ return this.verifyOtp.get('code1') }
  get code2(){ return this.verifyOtp.get('code2') }
  get code3(){ return this.verifyOtp.get('code3') }
  get code4(){ return this.verifyOtp.get('code4') }
  get code5(){ return this.verifyOtp.get('code5') }
  get code6(){ return this.verifyOtp.get('code6') }
  get keywords(){return this.searchForm.get("keywords")};
}
