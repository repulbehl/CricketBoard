import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../Service/authentication.service';
import { RegisterPlayer } from '../../model/RegisterPlayer';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  
  
  isCheckedCtrl : FormControl;

  nameCtrl : FormControl;
  emailCtrl : FormControl;
  passwordCtrl : FormControl;
  rePassWordCtrl : FormControl;
  errMsg: string | undefined;
  
  myform : FormGroup;
  constructor(builder : FormBuilder , private router : Router ,private authService:AuthenticationService ) {
    this.nameCtrl  = builder.control('',[Validators.required, Validators.minLength(2)]);
    this.emailCtrl =  builder.control('',[Validators.required, Validators.minLength(2)]);
    this.passwordCtrl =  builder.control('',[Validators.required, Validators.minLength(2)]);
    this.rePassWordCtrl = builder.control('',[Validators.required, Validators.minLength(2)]);
    this.isCheckedCtrl = builder.control('',[Validators.required]);
    const mapValues ={
      Name : this.nameCtrl,
      Email : this.emailCtrl,
      Password : this.passwordCtrl,
      RePassword : this.rePassWordCtrl,
      chck : this.isCheckedCtrl,
    }
    this.myform = builder.group(mapValues);
    
  }
  
  addUser(){
    if (!this.myform.valid) {
      this.myform.markAllAsTouched();
      return;
    }
    let userName = this.nameCtrl.value;
    let email = this.emailCtrl.value;
    let Password = this.passwordCtrl.value;
    let retype = this.rePassWordCtrl.value;
    let checkbox  = this.isCheckedCtrl.value;

    if(Password === retype && checkbox == true){
    const observable:Observable<RegisterPlayer>=this.authService.signup(userName, Password);
    observable.subscribe({
      next:(result : RegisterPlayer)=>{
        console.log(" User Registered");
        this.router.navigate(['/log-in']);
      },
      error:(err:Error)=>{
        this.errMsg = err.message;
      }
    });
    }
  }


  isControlTouchedOrDirty(control: FormControl) {
    return (control.touched || control.dirty);
  }

  isControlRequireValid(control: FormControl) {
    const touchedOrDirty = this.isControlTouchedOrDirty(control);
    if (!touchedOrDirty) {
      return true;
    }
    return !control.errors?.['required'];
  }

  isUserNameCtrlRequireValid() {
    const valid = this.isControlRequireValid(this.nameCtrl);
    return valid;
  }

  isUserNameCtrlMinLengthValid() {
    const touchedOrDirty = this.isControlTouchedOrDirty(this.nameCtrl);
    if (!touchedOrDirty) {
      return true;
    }
    return !this.nameCtrl.errors?.['minlength'];
  }
  isPassWordCtrlRequireValid() {
    const valid = this.isControlRequireValid(this.passwordCtrl);
    return valid;
  }

  isPassWordCtrlMinLengthValid() {
    const touchedOrDirty = this.isControlTouchedOrDirty(this.passwordCtrl);
    if (!touchedOrDirty) {
      return true;
    }
    return !this.passwordCtrl.errors?.['minlength'];
  }
  isRePassWordCtrlRequireValid() {
    const valid = this.isControlRequireValid(this.rePassWordCtrl);
    return valid;
  }

  isRePassWordCtrlMinLengthValid() {
    const touchedOrDirty = this.isControlTouchedOrDirty(this.rePassWordCtrl);
    if (!touchedOrDirty) {
      return true;
    }
    return !this.passwordCtrl.errors?.['minlength'];
  }
  isEmailCtrlRequireValid() {
    const valid = this.isControlRequireValid(this.emailCtrl);
    return valid;
  }

  isEmailCtrlMinLengthValid() {
    const touchedOrDirty = this.isControlTouchedOrDirty(this.emailCtrl);
    if (!touchedOrDirty) {
      return true;
    }
    return !this.emailCtrl.errors?.['minlength'];
  }
  isCheckedCtrlRequireValid() {
    const valid = this.isControlRequireValid(this.isCheckedCtrl);
    return valid;
  }

  ngOnInit(): void {
  }

}
