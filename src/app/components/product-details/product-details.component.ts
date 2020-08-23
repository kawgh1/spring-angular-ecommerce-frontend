import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  // here we generate a new product object each time a user selects a product
  // this allows method calls on that specific product instead of the same object which creates errors

  // Specifically, product properties are not assigned a value until the data arrives back
  // from the ProductService method call to REST API
  // and since it's an asynchronous call, if no product is selected, the async call is attempting
  // to assign properties to an undefined product object that hasn't been instantiated yet
  // thus, instead of product: Product; we do product: Product = new Product();
  // so async call always has a product object to assign properties
  product: Product = new Product();


  // inject dependencies
  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {

      this.handleProductsDetails();
    })
  }


  handleProductsDetails() {

    // get the "id" param string and convert string to a number using the "+" symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id');

    this.productService.getProduct(theProductId).subscribe(

      data => {

        this.product = data;

      }
    )
  }

}
