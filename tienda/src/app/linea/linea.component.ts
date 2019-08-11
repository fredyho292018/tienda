import {Component, OnInit} from '@angular/core';

import {LineaService} from '../services/linea.service';
import { AuthService } from '../services/auth.service';

import {Linea} from '../models/linea';

@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.css']
})
export class LineaComponent implements OnInit {
  lineas: Linea[] = [];
  errorMsg = '';
  isLoading = true;
  selectedLinea: Linea = null;

  constructor(private lineaService: LineaService, public authService: AuthService) {
  }

  ngOnInit() {
    this.getLineas();
  }

  getLineas() {
    this.lineaService.getLineas().subscribe((data: any) => {
      const param: Linea[] = data.lineas;
      this.lineas.push(new Linea(0, 'Todas', ''));
      param.forEach(item => { this.lineas.push(item); });

      const allLineaIndex = this.lineas.findIndex(value => value.id === 0);
      if (allLineaIndex !== -1) {
        this.selectedLinea = this.lineas[allLineaIndex];
      }
    }, error => {
      this.errorMsg = error.message;
    }, () => this.isLoading = false);
  }

  selectLinea(linea: Linea) {
    this.selectedLinea = linea;
  }
}
