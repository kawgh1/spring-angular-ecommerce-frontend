import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProductService } from 'src/app/services/product.service';

import { Routes, RouterModule, Router } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';


// Pagination required installing ng-bootstrap
// had to run
// ng add @angular/localize
// npm install @ng-bootstrap/ng-bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component'; // ng-bootstrap for pagination
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

// Okta - SignIn imports
import {
  OKTA_CONFIG,
  OktaAuthModule,
  OktaCallbackComponent,
  OktaAuthGuard
} from '@okta/okta-angular';

import myAppConfig from './config/my-app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

// HTTP Interceptors
import { AuthInterceptorService } from './services/auth-interceptor.service';

const oktaConfig = Object.assign({

  // let's create this new object 'onAuthRequired' so when a user tries to login to our application
  // and they haven't been authenticated with Okta, then we'll automatically route them to the login page
  onAuthRequired: (oktaAuth, injector) => {
    const router = injector.get(Router);

    // Redirect the user to your custom login page
    router.navigate(['/login']);
  }
}, myAppConfig.oidc);


// Order of routes is important
// First Match wins
// Start from most specific to most generic

const routes: Routes = [

  // OrderHistory route
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard] }, // Angular Route Guard using OktaAuthGuard
  // Members route
  { path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard] }, // Angular Route Guard using OktaAuthGuard

  /* 
    re: OktaCallbackComponent
    Once the user is authenticated, they are redirected to your app
    Normally, you would need to parse the response and store the OAuth+OIDC tokens
    The OktaCallbackComponent does this for you
  */
  { path: 'login/callback', component: OktaCallbackComponent },
  { path: 'login', component: LoginComponent },






  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart-details', component: CartDetailsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'search/:keyword', component: ProductListComponent },
  // { path: 'category/:id', component: ProductListComponent },
  { path: 'category/:id/:name', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  // if no path specified, go to products
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  // if any other path entered besides what's above, go to products
  { path: '**', redirectTo: '/products', pathMatch: 'full' }

];






@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes), // Then configure Router based on Routes
    BrowserModule,
    HttpClientModule,
    NgbModule, // ng module for pagination from ng-bootstrap
    ReactiveFormsModule, // gives support for Reactive Forms
    OktaAuthModule
  ],
  // this allows us to inject the ProductService into other parts of the application - oktaConfig is separate
  providers: [ProductService, { provide: OKTA_CONFIG, useValue: oktaConfig },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
