import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {ToastrModule} from 'ngx-toastr';
import {NgxPaginationModule} from 'ngx-pagination';
import {TooltipModule} from 'ng2-tooltip-directive';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faHome, 
  faShoppingCart, 
  faShoppingBag, 
  faTrashAlt, 
  faSignOutAlt, 
  faSignInAlt, 
  faSave, 
  faSearch, 
  faPencilAlt, 
  faArrowLeft,
  faPlus,
  faBan,
  faEye,
  
  faImage
} from '@fortawesome/free-solid-svg-icons';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { StoreComponent } from './store/store.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProductoComponent } from './producto/producto.component';
import { LineaComponent } from './linea/linea.component';
import {HttpErrorInterceptor} from './http-error-interceptor';
import { CartSummaryComponent } from './cart-summary/cart-summary.component';
import { CartDetailsComponent } from './cart-details/cart-details.component';
import { RegisterComponent } from './register/register.component';
import { AdicionarProductoComponent } from './adicionar-producto/adicionar-producto.component';

import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ProductoDetallesComponent } from './producto-detalles/producto-detalles.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    StoreComponent,
    HeaderComponent,
    FooterComponent,
    ProductoComponent,
    LineaComponent,
    CartSummaryComponent,
    CartDetailsComponent,
    RegisterComponent,
    AdicionarProductoComponent,
    ProductoDetallesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    TooltipModule,
    InfiniteScrollModule,
    NgbModule,
    NgbModalModule,
    FontAwesomeModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ProductoDetallesComponent]
})
export class AppModule {

  constructor() {
    library.add(faHome);
    library.add(faShoppingCart);
    library.add(faShoppingBag);
    library.add(faTrashAlt);
    library.add(faSignInAlt);
    library.add(faSignOutAlt);
    library.add(faSave);
    library.add(faSearch);
    library.add(faPencilAlt);
    library.add(faArrowLeft);
    library.add(faPlus);
    library.add(faBan);
    library.add(faEye);
    library.add(faImage);
  }
}
