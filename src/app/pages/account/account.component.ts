import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators} from '@angular/forms'
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  user;
  wishList;
  images=[];

  submitEditUser(){
    if(this.editUser.status !=="INVALID"){
      const fd = new FormData();
      fd.append("full_name",this.user.full_name)
      // fd.append("phone",this.phone.value)
      fd.append("email",this.user.email)
      fd.append("snapchat",this.user.snapchat)
      fd.append("facebook",this.user.facebook)
      fd.append("twitter",this.user.twitter)
      fd.append("youtube",this.user.youtube)
      fd.append("social_email",this.user.social_email);
      if(this.images.length){
        for(var i=0;i<this.images.length;i++){
          
          fd.append("image",this.images[i])
        }
      }

      this.http.put('http://45.55.54.157/api/accounts/profile/',fd,{
        headers:{
          Authorization: 'Bearer ' +JSON.parse(localStorage.getItem('77carsalelogin'))['access']
        }
      }).subscribe(user => {
        this.user = user
        console.log(user)
      }, error =>{
        console.log(error)
      })
    }
    console.log(this.editUser);

  }
  onFileChange(event) {
        this.images = event.target.files;

        console.log(this.images)
  }
  editUser = new FormGroup({
    full_name : new FormControl(''),
    email : new FormControl('',Validators.email),
    phone : new FormControl('',[
      Validators.required,
      Validators.maxLength(10 ),
      Validators.minLength(10 )
    ]),
    snapchat : new FormControl(''),
    facebook : new FormControl(''),
    twitter : new FormControl(''),
    youtube : new FormControl(''),
    social_email : new FormControl(''),
    image : new FormControl([])
  });
  get email () { return this.editUser.get("email")};
  get phone () { return this.editUser.get("phone")};
  get full_name () { return this.editUser.get("full_name")};
  get snapchat () { return this.editUser.get("snapchat")};
  get facebook () { return this.editUser.get("facebook")};
  get twitter () { return this.editUser.get("twitter")};
  get youtube () { return this.editUser.get("youtube")};
  get social_email () { return this.editUser.get("social_email")};
  get image () { return this.editUser.get("image")};
  constructor(private http:HttpClient) { }
  ngOnInit(): void {
    this.http.get('http://45.55.54.157/api/accounts/profile/',{
        headers:{
          Authorization:'Bearer ' +JSON.parse(localStorage.getItem('77carsalelogin'))['access']
        }
      }).subscribe( user => {
        this.user = user
        console.log(this.user);
      }, error =>{
        console.log(error)
      });
    this.http.get('http://45.55.54.157/api/accounts/wishlist/',{
        headers:{
          Authorization:'Bearer ' +JSON.parse(localStorage.getItem('77carsalelogin'))['access']
        }
      }).subscribe( wishList => {
        this.wishList = wishList
        console.log(this.wishList);
      }, error =>{
        console.log(error)
      });

  }

}
