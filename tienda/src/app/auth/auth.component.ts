import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  errorMsg = '';

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      correo: new FormControl(null, [Validators.required, Validators.email]),
      contrasena: new FormControl(null, Validators.required)
    });
  }

  authOnSubmit() {
    this.isSubmitted = true;

    if (this.form.valid) {
      this.authService.authenticate(this.form.value).subscribe(value => {
        if (value.error === false) {
          this.router.navigateByUrl('/store');
        } else {
          this.errorMsg = value.mensaje;
        }
      });
      this.form.reset();
      this.isSubmitted = false;
    }
    this.errorMsg = '';
  }
}
