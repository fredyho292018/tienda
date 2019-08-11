import {FormControl, FormGroup, Validators} from '@angular/forms';

export class RegisterFormControl extends FormControl {
  label: string;
  modelProperty: string;

  constructor(label: string, property: string, value: any, validator: any) {
    super(value, validator);
    this.label = label;
    this.modelProperty = property;
  }

  getValidationMessages() {
    const messages: string[] = [];
    if (this.errors) {
      for (const errorName in this.errors) {
        switch (errorName) {
          case 'required':
            messages.push(`* ${this.label} requerido`);
            break;
          case 'minlength':
            messages.push(`${this.label} debería contener como mínimo ${this.errors.minlength.requiredLength} caracteres`);
            break;
          case 'maxlength':
            messages.push(`${this.label} debería contener como máximo ${this.errors.maxlength.requiredLength} caracteres`);
            break;
          case 'pattern':
            messages.push(`${this.label} contiene caracteres ilegales`);
            break;
        }
      }
    }
    return messages;
  }
}


export class RegisterFormGroup extends FormGroup {

  constructor() {
    super({
      correo: new RegisterFormControl('Correo', 'correo', '',
        Validators.compose([Validators.required,
        ])),

      contrasena: new RegisterFormControl('Contraseña', 'contrasena', '',
        Validators.compose([Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)])),

      confcontrasena: new RegisterFormControl('Confirmar contraseña', 'confcontrasena', '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)
        ]))
    });
  }

  get registerControls(): RegisterFormControl[] {
    return Object.keys(this.controls).map(k => this.controls[k] as RegisterFormControl);
  }

  getFormValidationMessages(form: any): string[] {
    const messages: string[] = [];
    this.registerControls.forEach(c => c.getValidationMessages().forEach(m => messages.push(m)));
    return messages;
  }
}
