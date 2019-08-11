import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {LineaService} from '../services/linea.service';
import {ProductoService} from '../services/producto.service';
import {Linea} from '../models/linea';
import { HttpParams } from '@angular/common/http';
import { async } from 'q';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-adicionar-producto',
  templateUrl: './adicionar-producto.component.html',
  styleUrls: ['./adicionar-producto.component.css']
})
export class AdicionarProductoComponent implements OnInit {
  form: FormGroup;
  form1: FormGroup;
  isSubmitted = false;
  lineas: Linea[] = [];
  successMsg = '';
  errorMsg = '';
  editing = false;
  imagen='';  
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private lineaService: LineaService,
     private productoService: ProductoService, 
     private formBuilder: FormBuilder,
     private autSer:AuthService,
     private toastr: ToastrService
     ) {
  }

  ngOnInit() {
   if(!this.autSer.isAdmin()){
      this.router.navigate(['/auth']);
   }else{
    this.form = new FormGroup({
      codigo: new FormControl(null, Validators.required),
      producto: new FormControl(null, [Validators.required, Validators.pattern('^[A-Za-z 0-9 ]+$')]),
      linea: new FormControl('', Validators.required),
      proveedor: new FormControl(null, Validators.required),
      descripcion: new FormControl(null, Validators.required),
      precio_compra: new FormControl(null, [Validators.required,Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]),
     
    });
    this.form1 = this.formBuilder.group({
      imagen: ['']
    });

    this.lineaService.getLineas().subscribe((data: any) => {
      this.lineas = data.lineas;
    });

    this.editing = this.route.snapshot.params['mode'] == 'edit';
    const codigo = this.route.snapshot.params['codigo'];

    if(codigo !== null && codigo !== undefined) {
      const producto = this.route.snapshot.params['producto'];
      const linea = this.route.snapshot.params['linea'];
      const proveedor = this.route.snapshot.params['proveedor'];
      const descripcion = this.route.snapshot.params['descripcion'];
      const precio_compra = this.route.snapshot.params['precio_compra'];

      this.form.setValue({ 
        codigo: codigo,  
        producto: producto,
        linea: linea,
        proveedor: proveedor,
        descripcion: descripcion,
        precio_compra: precio_compra
      });  
    }
   }
    
  }

  addOnSubmit() {  
    if(this.imagen=='') {
      this.toastr.info('Seleccione una imagen jpg o png',); 
      return;
    } 
    this.isSubmitted = true;    
    if (this.form.valid) {        
      this.productoService.addOrUpdate(JSON.stringify(this.form.value)).subscribe((data: any) => {
        if (data.error === false) {
          this.successMsg = data.mensaje;    
         this.router.navigate(['/store'])    
         this.onSubmit()      ;
        } else {
          this.errorMsg = data.mensaje;
        }
      });
     
      this.isSubmitted = false;
      this.form.reset();
    }
  }

  selectOnChange(event: any) {
    this.form.get('linea').setValue(event.target.value);
  }
  cargandoImagen(even){
    console.log(even);
    this.imagen=even[0].name;
    console.log(this.imagen);
  }
  get formMode(): string{
    return this.editing == true ? 'Editar': 'Crear';
  }
  
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imagen=file.name;
     this.form1.get('imagen').setValue(file);
    }
  }
  onSubmit() {   
    
    if(this.imagen=='') {
      this.toastr.info('Seleccione una imagen jpg o png',); 
      return;
    } 
    console.log(this.form.value.codigo);
    if(this.form.value.codigo==null || this.form.value.codigo=='') {
      this.toastr.info('Revise sus datos',); 
      return;
    } 
    let ext=this.imagen.split('.')[1];
    console.log(ext);
    if(ext!='jpg' && ext!='png'){
      this.toastr.info('Seleccione una imagen jpg o png'); 
      return;
    }
    const formData = new FormData();
    formData.append('imagen', this.form1.get('imagen').value);
    formData.append('codigo',this.form.value.codigo);
    this.productoService.foto(formData).subscribe(
      (res) => {        
          console.log(res);
          this.toastr.success(res.mensaje); 
      },
      (err) => {  
        console.log(err);
      }
    );
     }
}
