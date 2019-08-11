import { Injectable } from '@angular/core';

import {CartItem} from '../models/cart-item';
import {Producto} from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  elementos: CartItem[] = [];
  total: 0;
  precio: 0;

  constructor() { }

  addProducto(producto: Producto, cantidad: number = 1) {
    if (JSON.parse(localStorage.getItem('cart')) === null) {
      const cart: any = [];
      cart.push(JSON.stringify(new CartItem(producto, cantidad)));
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      const cart: any = JSON.parse(localStorage.getItem('cart'));

      let index = -1;

      for (let i = 0; i < cart.length; i++) {
        const item: CartItem = JSON.parse(cart[i]);

        if (item.producto.codigo === producto.codigo) {
          index = i;
          break;
        }
      }

      if (index === -1) {
        cart.push(JSON.stringify(new CartItem(producto, cantidad)));
        localStorage.setItem('cart', JSON.stringify(cart));
      } else {
        const item: CartItem = JSON.parse(cart[index]);
        item.cantidad += 1;
        cart[index] = JSON.stringify(item);
        localStorage.setItem('cart', JSON.stringify(cart));
      }
      this.load();
    }
    this.load();
  }

  modCantidad(codigo: string, cantidad: number) {
    const cart: any = JSON.parse(localStorage.getItem('cart'));

    let index = -1;
    for (let i = 0; i < cart.length; i++) {
      const item: CartItem = JSON.parse(cart[i]);
      if (item.producto.codigo === codigo) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      const item: CartItem = JSON.parse(cart[index]);
      item.cantidad = cantidad;
      cart[index] = JSON.stringify(item);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    this.load();
  }

  delProducto(codigo: string): void {
    const cart: any = JSON.parse(localStorage.getItem('cart'));
    const index = -1;
    for (let i = 0; i < cart.length; i++) {
      const item: CartItem = JSON.parse(cart[i]);
      if (item.producto.codigo === codigo) {
        cart.splice(i, 1);
        break;
      }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    this.load();
  }

  load() {
    if (localStorage.getItem('cart') !== null) {
      this.elementos = [];
      this.total = 0;
      this.precio = 0;

      const cart = JSON.parse(localStorage.getItem('cart'));
      for (const i of cart) {
        const item: CartItem = JSON.parse(i);
        this.elementos.push(new CartItem(item.producto, item.cantidad));
        this.total += item.cantidad;
        this.precio += item.cantidad * item.producto.precio_compra;
      }
    }
  }

  clear() {
    localStorage.removeItem('cart');
    this.elementos = [];
    this.total = 0;
    this.precio = 0;
  }
}
