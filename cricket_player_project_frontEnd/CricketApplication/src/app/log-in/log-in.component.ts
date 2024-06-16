import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../Service/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  myform: FormGroup;
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;
  errMsg: string | undefined;



  constructor(builder: FormBuilder, private router: Router, private authService: AuthenticationService) {
    this.usernameCtrl = builder.control('', [Validators.required, Validators.minLength(2)]);
    this.passwordCtrl = builder.control('', [Validators.required, Validators.minLength(2)]);
    let mapValues = {
      username: this.usernameCtrl,
      Password: this.passwordCtrl
    }
    this.myform = builder.group(mapValues);
  }

  checkUser() {
    if (!this.myform.valid) {
      this.myform.markAllAsTouched();
      return;
    }
    console.log("User added Login");
    let username = this.usernameCtrl.value;
    let password = this.passwordCtrl.value;
    const observable: Observable<string> = this.authService.login(username, password);
    observable.subscribe({
      next: (token: string) => {
        console.log("received token", token);
        this.errMsg = undefined;
        this.authService.saveToken(username, token);
        this.router.navigate(['/dashboard']);
      },
      error: (err: Error) => {
        this.errMsg = err.message;
      }
    });
    console.log("inside onFormSubmit username=" + username + " ,password=" + password);
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
    const valid = this.isControlRequireValid(this.usernameCtrl);
    return valid;
  }

  isUserNameCtrlMinLengthValid() {
    const touchedOrDirty = this.isControlTouchedOrDirty(this.usernameCtrl);
    if (!touchedOrDirty) {
      return true;
    }
    return !this.usernameCtrl.errors?.['minlength'];
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


  ngOnInit(): void {

  }


  movePage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
}
