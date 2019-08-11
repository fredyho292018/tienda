import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AuthComponent} from './auth/auth.component';
import {StoreComponent} from './store/store.component';
import {ProductoComponent} from './producto/producto.component';
import {RegisterComponent} from './register/register.component';
import { CartDetailsComponent } from './cart-details/cart-details.component';
import {AdicionarProductoComponent} from './adicionar-producto/adicionar-producto.component';

const routes: Routes = [
  {path: '', component: StoreComponent},
  {path: 'store', component: StoreComponent},
  {path: 'auth', component: AuthComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'productos', component: ProductoComponent},
  {path: 'add-producto/:mode', component: AdicionarProductoComponent},
  {path: 'cart-details', component: CartDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
