import {Component, Input, OnInit} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {Producto} from '../models/producto';

@Component({
  selector: 'app-producto-detalles',
  templateUrl: './producto-detalles.component.html',
  styleUrls: ['./producto-detalles.component.css']
})
export class ProductoDetallesComponent implements OnInit {
  @Input() producto: Producto;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    
  }
}
