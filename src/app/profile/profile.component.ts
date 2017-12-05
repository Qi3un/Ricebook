import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { CustomValidators } from 'ng2-validation';
import { NAME_REGEX, EMAIL_REGEX, PHONE_REGEX, signData} from '../auth/auth.component'
import { DatePipe } from '@angular/common';
import { FollowService } from '../article/follow.service';
import { ProfileService } from './profile.service';
import { base64ArrayBuffer } from '../article/article.component';
import { user } from '../auth/user';

const CODE_REGEX = /(\d){5}/;
const defaultUser = {
  id: 0,
  name: "defaultUser",
  fbID: null,
  disName: "defaultUser",
  email: "default@default.default",
  phone: "123-123-1234",
  birth: new Date(),
  code: "12345",
  password: "",
  headline: "",
  avatar: null
}


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../app.component.css']
})
export class ProfileComponent implements OnInit {
  constructor( public datepipe: DatePipe,
               private followService: FollowService,
               private sanitizer: DomSanitizer,
               private profileService: ProfileService,
               private snackBar: MatSnackBar ) { }

  user = defaultUser;
  profileForm: FormGroup;
  avatar: string;
  _pass: string;
  _passConf: string;
  newAvatar: string;

  ngOnInit() {
  	this.loadUser();
  	let pass = new FormControl(this._pass, []);
  	let passConf = new FormControl(this._passConf, [CustomValidators.equalTo(pass)]);
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
    this.followService
        .getProfile()
        .then(r => {
          this.user.id = r._id;
          this.user.name = r.username;
          this.user.fbID = r.fbID;
          this.user.disName = r.displayName || r.username;
          this.user.email = r.email;
          this.user.phone = r.phone;
          this.user.birth = r.dob;
          this.user.code = r.zipcode;
          this.user.avatar = r.avatar.data ?
            this.sanitizer.bypassSecurityTrustResourceUrl(
              base64ArrayBuffer(r.avatar.contentType, r.avatar.data.data)) : (r.avatar.url ? r.avatar.url : null);
          this.user.headline = r.headline;
        })
  }

  updatePro(): void {
    this.user.password = this.profileForm.controls['pass'].value
    this.profileService
        .updateProfile(this.user, this.newAvatar)
        .then(_ => {
          this.newAvatar = ""
          console.log("succeed in component")
          this.snackBar.open("Update saved! Back to homepage to check your new profile!", "", { duration: 3000 })
          return
        })
  }

  handleImageChange(event: any): void{
    if(event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      // console.log("dude");

      reader.onload = (event: any) => {
        this.avatar = event.target.result;
        // console.log(this.avatar);
      }
      this.newAvatar = event.target.files[0];
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
