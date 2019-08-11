import {AbstractControl} from '@angular/forms';

export class ConfirmPassword {

  static MatchPassword(control: AbstractControl) {
    const password = control.get('contrasena').value;
    const confirmPassword = control.get('confcontrasena').value;

    if (password !== confirmPassword) {
      control.get('confcontrasena').setErrors({ ConfirmPassword: true });
    } else {
      return null;
    }
  }
}
