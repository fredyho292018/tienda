import {Producto} from './producto';

export class CartItem {

  constructor(public producto: Producto, public cantidad) {

  }

  getPrecio(): number {
      return this.cantidad * this.producto.precio_compra;
  }
}
