import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from 'src/app/services/product.service';

import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';

// Order of routes is important
// First Match wins
// Start from most specific to most generic

const routes: Routes = [
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
    ProductCategoryMenuComponent
  ],
  imports: [
    RouterModule.forRoot(routes), // Then configure Router based on Routes
    BrowserModule,
    HttpClientModule
  ],
  providers: [ProductService], // this allows us to inject the ProductService into other parts of the application
  bootstrap: [AppComponent]
})
export class AppModule { }
