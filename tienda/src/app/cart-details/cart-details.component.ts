import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { PedidoService } from '../services/pedido.service';

import { Producto } from '../models/producto';
import { Login } from '../models/login';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  successMsg = '';
  errorMsg = '';

  config = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.cartService.elementos.length
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

  constructor(private router: Router, public cartService: CartService, private authService: AuthService,
              private pedidoService: PedidoService, private toastr: ToastrService) { }

  ngOnInit() {
  }

  changeCantidad(codigo: string, $event) {
   if($event.target.value == 0){
      this.errorMsg = 'Debe introducir una cantidad mayor que 0. Se modificará la cantidad a 1';

      const indice = this.cartService.elementos.findIndex(item => item.producto.codigo == codigo);
      if(indice !== -1){
        this.cartService.modCantidad(codigo, 1);
      }
    }else{
      this.cartService.modCantidad(codigo, Number($event.target.value));
    }  
  }

  goToComprar() {
    if (this.authService.isLoggedIn()) {
      const idProductos: string[] = [];
      this.cartService.elementos.forEach(value => idProductos.push(value.producto.codigo));

      let login: Login = new Login();
      login = JSON.parse(localStorage.getItem('currentUser'));

      this.pedidoService.addOrden(login.token, login.id_usuario.toString(), idProductos).subscribe(value => {
        if (value.error === false) {
          this.successMsg = 'Pedido completado';
          this.cartService.clear();
        } else {
          console.log(value.mensaje);
          this.errorMsg = value.mensaje;
        }
      });
    } else {
      this.router.navigateByUrl('/auth');
    }
  }

  eliminarProducto(producto: Producto) {
    this.cartService.delProducto(producto.codigo);
    this.toastr.success('Producto ' + producto.producto + ' ha sido eliminado del carrito', null);
  }

  get cartVacioTooltip(): string{
    return this.cartService.elementos.length == 0 ? 'Tu carrito está vacio': 'Comprar';
  }
}
