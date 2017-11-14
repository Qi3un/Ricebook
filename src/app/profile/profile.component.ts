import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { NAME_REGEX, EMAIL_REGEX, PHONE_REGEX, signData} from '../auth/auth.component'
import { DatePipe } from '@angular/common';

const CODE_REGEX = /(\d){5}/;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../app.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(public datepipe: DatePipe) { }

  user: signData;
  profileForm: FormGroup;
  maxDate: Date;
  now: Date;
  avatar: string;

  ngOnInit() {
  	this.now = new Date();
  	this.maxDate = new Date(this.now.getFullYear() - 18, this.now.getMonth(), this.now.getDate());
  	this.loadUser();
  	let pass = new FormControl(this.user.pass, []);
  	let passConf = new FormControl(this.user.passConf, [CustomValidators.equalTo(pass)]);
  	this.profileForm = new FormGroup({
      'disName': new FormControl(this.user.disName, []),
  		'email': new FormControl(this.user.email, [Validators.pattern(EMAIL_REGEX)]),
  		'phone': new FormControl(this.user.phone, [Validators.pattern(PHONE_REGEX), CustomValidators.rangeLength([12,12])]),
  		'birth': new FormControl({value: this.datepipe.transform(this.user.birth, 'yyyy-MM-dd'), disabled: true}, []),
  		'code': new FormControl(this.user.code, [Validators.pattern(CODE_REGEX)]),
  		'pass': pass,
  		'passConf': passConf
  	});
  }

  loadUser(): void {
  	if(localStorage.user) {
      var user = JSON.parse(localStorage.user);
  		const userInfo: signData = {
  			'name': user.name,
	  		'disName': user.disName,
	  		'email': user.email,
	  		'phone': user.phone,
	  		'birth': user.birth,
	  		'code': user.code,
	  		'pass': user.pass,
	  		"passConf": user.pass
  		};
  		this.user = userInfo;
      // console.log("disName", user.disName);
      if(user.disName == "Morty")
        this.avatar = "http://www.uuwtq.com/file/image/tx/3w4013592245u2536567220t28.jpg";
      else if(user.disName == "Rick")
        this.avatar = "https://vignette.wikia.nocookie.net/rickandmorty/images/d/dd/Rick.png/revision/latest?cb=20131230003659";
      // else {
      //   console.log("no disName matched");
      // }
  	}
  	else {
  		const userInfo: signData = {
	  		'name': "Morty",
	  		'disName': "Morty",
	  		'email': "morty@rick.com",
	  		'phone': "222-222-2222",
	  		'birth': this.maxDate,
	  		'code': "22222",
	  		'pass': "222",
	  		"passConf": "222",
  		};
  		this.user = userInfo;
  	}
  }

  updatePro(disName: string, email: string, phone: string, code: string, pass: string): void {
    var user = JSON.parse(localStorage.user);
		if(disName)
  		user.disName = disName;
  	if(email)
  		user.email = email;
  	if(phone)
  		user.phone = phone;
  	if(code)
  		user.code = code;
  	if(pass)
  		user.pass = pass;
    localStorage.setItem("user", JSON.stringify(user));
  	return;
  }

  handleImageChange(event: any): void{
    if(event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      // console.log("dude");

      reader.onload = (event: any) => {
        this.avatar = event.target.result;
        // console.log(this.avatar);
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  get name() { return this.profileForm.get('name'); }

  get email() { return this.profileForm.get('email'); }

  get phone() { return this.profileForm.get('phone'); }

  get birth() { return this.profileForm.get('birth'); }

  get code() { return this.profileForm.get('code'); }

  get pass() { return this.profileForm.get('pass'); }

  get passConf() { return this.profileForm.get('passConf'); }
}
