import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-list',
  // templateUrl: './product-list.component.html',
  // templateUrl: './product-list-table.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = null;

  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute) { }

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

    // if we have a different keyword than previous then set thePageNumber to 1

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    // now search for products using the given keyword
    // this.productService.searchProducts(theKeyword).subscribe(

    //   data => {

    //     this.products = data;

    //   }
    // );

    this.productService.searchProductsPaginate(this.thePageNumber - 1,
      this.thePageSize,
      theKeyword).subscribe(this.processResult());

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

    // pagination workflow
    //
    // Check if we hae a different category than previous (state)
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than previous,
    // then reset thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);




    // now get the products for the given category id
    // this.productService.getProductList(this.currentCategoryId).subscribe(

    //   data => {
    //     this.products = data;
    //   }
    // );

    // Angular Pagination component: pages are 1 Based 
    // Spring Data REST: pages are 0 Based, thus pageNumber - 1
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(this.processResult());

  }

  // On the left are properties defined in this class
  // on the right is the data rec'd back from Spring Data REST JSON database
  // so we're assigning the returned JSON data as the properties for pagination display
  processResult() {

    return data => {

      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1; // + 1 because Spring Data REST is 0 based
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements; // defined as totalElements in product.service.ts

    };
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }



  // ADD TO CART METHODS
  addToCart(theProduct: Product) {

    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    // TODO ... do the real work
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}
