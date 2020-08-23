import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  // templateUrl: './product-list.component.html',
  // templateUrl: './product-list-table.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  currentCategoryName: string;
  searchMode: boolean;

  constructor(private productService: ProductService, private route: ActivatedRoute) {



  }

  ngOnInit(): void { // similar to @PostConstruct where we will actually call our List Products method

    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });


  }

  // the method is  invoked once you "subscribe"
  // this method will run in an asynchronous fashion
  // and once it has returned, we can assign it to our own property to display

  listProducts() {

    // // check if "id" paramter is available first
    // const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    // if (hasCategoryId) {
    //   // get the "id" param string. convert string to a number using the "+" symbol
    //   this.currentCategoryId = +this.route.snapshot.paramMap.get('id');

    //   // get the "name" param string
    //   this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    // }
    // else {
    //   // not category id available ... default to category id 1
    //   this.currentCategoryId = 1;
    //   this.currentCategoryName = 'Books';
    // }

    // // now get the products for the given category id
    // this.productService.getProductList(this.currentCategoryId).subscribe(

    //   data => {
    //     this.products = data;
    //   }
    // );

    // basically checking, did user type something into search bar?
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    // if yes, then call the search method
    if (this.searchMode) {

      this.handleSearchProducts();

      // otherwise, just list the products
    } else {

      this.handleListProducts();
    }

  }


  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // now search for products using the given keyword
    this.productService.searchProducts(theKeyword).subscribe(

      data => {

        this.products = data;

      }
    );
  }


  handleListProducts() {

    // check if "id" paramter is available first
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    // now get the products for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(

      data => {
        this.products = data;
      }
    );

  }

}
