import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginService } from '../../core/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  loginError = false;
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<LoginComponent>, private loginService: LoginService) {}

  ngOnInit() {
    this.formGroup = new FormGroup({
      username: new FormControl('', Validators.min(3)),
      password: new FormControl('', Validators.required),
    });
  }

  onLogin() {
    const formData = this.formGroup.value;

    if (this.loginService.checkCredentials(formData.username, formData.password)) {
      this.dialogRef.close({success: true});
    }

    this.loginError = true;
  }
}
