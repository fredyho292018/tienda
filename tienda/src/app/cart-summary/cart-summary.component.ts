import { Component, OnInit } from '@angular/core';

import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.css']
})
export class CartSummaryComponent implements OnInit {

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartService.load();
  }

}
