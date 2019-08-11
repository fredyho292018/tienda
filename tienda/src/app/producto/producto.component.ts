import {Component, Input, OnChanges, OnInit, SimpleChanges, HostListener, ɵConsole} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {ToastrService} from 'ngx-toastr';

import { AuthService } from '../services/auth.service';
import {ProductoService} from '../services/producto.service';
import {CartService} from '../services/cart.service';

import {Producto} from '../models/producto';
import {Linea} from '../models/linea';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductoDetallesComponent } from '../producto-detalles/producto-detalles.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, OnChanges {
  form: FormGroup;
  isSubmitted = false;
  producto: Producto = new Producto();

  productos: Producto[] = [];
  errorMsg = '';
  isLoading = true;
  @Input() linea: Linea;

  config = {
    id: 'custom',
    itemsPerPage: 8,
    currentPage: 1,
    totalItems: this.productos.length
  };

  public maxSize = 7;
  public directionLinks = true;
  public autoHide = false;
  public responsive = true;
  public labels: any = {
    previousLabel: '<--',
    nextLabel: '-->',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };

  pagina=0;
  showScrollHeight = 400;
  hideScrollHeight = 200;  
   showGoUpButton: boolean;
   lineaid=0;
  constructor(
    public authService: AuthService, 
    private productoService: ProductoService, 
    private cartService: CartService, 
    private toastr: ToastrService,
    private modalService: NgbModal
    ) {
    this.showGoUpButton=false;
  }

  ngOnInit() {
    // this.getProductos();

    this.form = new FormGroup({
      nombre: new FormControl('', Validators.pattern('^[A-Za-z 0-9]+$')),
    });
  }

  getProductos() {
    this.productoService.getProductos(this.pagina).subscribe((data: any) => {
      this.productos.push(...data.productos) ;
    }, error => {
      this.errorMsg = error.message;
    }, () => this.isLoading = false);
  }

  searchOnSubmit() {
    this.isSubmitted = true;
    console.log(this.form.value);
    this.productos.splice(0,this.productos.length);
    if (this.form.valid) {
      if(this.form.value.nombre!='' && this.form.value.nommbre!=null){
        this.productoService.buscarProducto(this.form.value.nombre).subscribe(value => {
         
          this.productos.push(...value.productos) ;
        });
        this.form.reset();
        this.isSubmitted = false;
      }else{
        this.getProductos();
      }
      
    }
    this.errorMsg = '';
  }

  ngOnChanges(changes: SimpleChanges): void {


    
    if (changes.linea && this.linea !== null) {

      if (this.linea.id === 0) {
        this.getProductos();
        this.lineaid=0;
      } else {
        this.pagina=0;
        this.productos.splice(0,this.productos.length);
         this.productoService.getProductoPorLinea(this.linea.id,this.pagina).subscribe((data: any) => {
           this.productos.push(...data.productos);
           this.lineaid=this.linea.id;
         }, error => {
           this.errorMsg = error.message;
         }, () => this.isLoading = false);
       
      }
    }
   
  }

  addProductoCarro(producto: Producto) {
    this.cartService.addProducto(producto);
    this.toastr.success('Producto ' + producto.producto + ' ha sido añadido al carrito', null);
  }

  eliminarProducto(codigo: string) {
    console.log(codigo);
    this.productoService.eliminarProducto(codigo).subscribe((data: any) => {
      if(data.error === false){
        this.toastr.success(data.mensaje, null);

        const indice = this.productos.findIndex(item => item.codigo == codigo);
        if(indice !== -1) {
          this.productos.splice(indice, 1);
        }
      }else{
        this.toastr.error(data.mensaje, null);
      }
    });
  }
  onScroll() {
    if (this.pagina < 1000) {
     console.log(this.lineaid);
     this.pagina ++;
      if (this.lineaid === 0) {
        this.getProductos();
      } else {
      
        
         this.productoService.getProductoPorLinea(this.linea.id,this.pagina).subscribe((data: any) => {
           this.productos.push(...data.productos);
         }, error => {
           this.errorMsg = error.message;
         }, () => this.isLoading = false);
      }
     
      
    } else {
      console.log('No more lines. Finish page!');

    }
  }
  scrollTop() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Other
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (( window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop) > this.showScrollHeight) {
      this.showGoUpButton = true;
    } else if ( this.showGoUpButton &&
      (window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop)
      < this.hideScrollHeight) {
      this.showGoUpButton = false;
    }
  }
  open(producto: Producto) {
    const modalRef = this.modalService.open(ProductoDetallesComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.producto = producto;
  }
}
