import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  productCategories: ProductCategory[];
  title = 'angular-ecommerce';

  // The code below was pasted from product-category-menu.ts
  // to dynamically display Product Categories dynamically on Mobile View
  // Without a page reload

  // inject product service
  constructor(private productService: ProductService) { }

  ngOnInit(): void {

    this.listProductCategories();
  }

  listProductCategories() {

    this.productService.getProductCategories().subscribe(

      data => {

        console.log('Product Categories=' + JSON.stringify(data));

        this.productCategories = data;
      }
    );
  }
}




