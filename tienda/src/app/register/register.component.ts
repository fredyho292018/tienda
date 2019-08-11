import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {Login} from '../models/login';
import {AuthService} from '../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmPassword} from '../validators/confirm-password';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  successMsg = '';
  errorMsg = '';

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      correo: new FormControl(null, [Validators.required, Validators.email]),
      contrasena: new FormControl(null, Validators.required),
      confcontrasena: new FormControl(null, Validators.required),
    },
      { validators: ConfirmPassword.MatchPassword });
  }

  registerOnSubmit() {
    this.isSubmitted = true;

    if (this.form.valid) {

      const login: Login = new Login();
      login.correo = this.form.value.correo;
      login.contrasena = this.form.value.contrasena;
      login.confcontrasena = this.form.value.confcontrasena;
      login.rol = 'usuario';

      this.authService.register(login).subscribe(value => {
        if (value.error === false) {
          this.successMsg = value.mensaje;
        } else {
          this.errorMsg = value.mensaje;
        }
      });
      this.form.reset();
      this.isSubmitted = false;
    }

    this.successMsg = '';
    this.errorMsg = '';
  }
}
