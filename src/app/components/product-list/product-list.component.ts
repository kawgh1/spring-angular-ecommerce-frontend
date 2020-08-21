import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../../common/product';

@Component({
  selector: 'app-product-list',
  // templateUrl: './product-list.component.html',
  // templateUrl: './product-list-table.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];

  constructor(private productService: ProductService) {



  }

  ngOnInit(): void { // similar to @PostConstruct where we will actually call our List Products method

    this.listProducts();

  }

  // the method is  invoked once you "subscribe"
  // this method will run in an asynchronous fashion
  // and once it has returned, we can assign it to our own property to display

  listProducts() {

    this.productService.getProductList().subscribe(

      data => {
        this.products = data;
      }
    )
  }

}
