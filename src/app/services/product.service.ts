import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  // DEVELOPMENT

  private baseUrl = "http://localhost:8080/api/products"; // hardcoded

  private categoryUrl = "http://localhost:8080/api/product-category";

  // PRODUCTION

  // private baseUrl = "https://springboot-angular-ecommerce.herokuapp.com/api/products"; // hardcoded

  // private categoryUrl = "https://springboot-angular-ecommerce.herokuapp.com/api/product-category";

  constructor(private httpClient: HttpClient) { }



  // this method is called when a user clicks a product image or name
  // used to show Product Details page by called REST API on product id
  getProduct(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);

  }

  // returns an Observable, maps the JSON data from Spring Data REST into a Product array
  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build URL based on category id

    // Since Spring Data REST in the Product Repository class automatically exposes 
    // this endpoint -> "http://localhost:8080/api/products/search/findByCategoryId"

    // so we build a dynamic search Url that takes in the user's click/input (as category id)

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    // return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
    return this.getProducts(searchUrl);


  }



  // helper method
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
  }



  // list products pagination method
  getProductListPaginate(thePage: number, thePageSize: number,
    theCategoryId: number): Observable<GetResponseProducts> {

    // need to build URL based on category id, page number and page size

    // Since Spring Data REST in the Product Repository class automatically exposes 
    // this endpoint -> "http://localhost:8080/api/products/search/findByCategoryId"

    // so we build a dynamic search Url that takes in the user's click/input (as category id)

    // since Spring Data REST supports pagination out of the box, just send the parameters
    // for page and size and the pagination url is recognized for data retrieval
    // http://localhost:8080/api/products?page=0&size=10

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }


  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build URL based on user entered 'keyword'

    const searchUrl = `${this.baseUrl}/search/findByNameContaining ? name = ${theKeyword} `;

    // return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
    return this.getProducts(searchUrl);

  }

  // search products pagination method
  searchProductsPaginate(thePage: number, thePageSize: number,
    theKeyword: string): Observable<GetResponseProducts> {

    // need to build URL based on category id, page number and page size

    // Since Spring Data REST in the Product Repository class automatically exposes 
    // this endpoint -> "http://localhost:8080/api/products/search/findByCategoryId"

    // so we build a dynamic search Url that takes in the user's click/input (as category id)

    // since Spring Data REST supports pagination out of the box, just send the parameters
    // for page and size and the pagination url is recognized for data retrieval
    // http://localhost:8080/api/products?page=0&size=10

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }


  // Returns an observable
  // Maps the JSON data from Spring Data REST to ProductCategory array
  // "this.categoryUrl" makes a call to the Spring Data REST API
  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }



}

interface GetResponseProducts { // unwraps the JSON from Spring Data REST _embedded entry

  _embedded: {
    products: Product[];
  },
  // pagination
  page: {
    size: number, // size of current page
    totalElements: number, // total 'count' of all elements in database, but not returning them
    totalPages: number, // Total pages available
    number: number // current page number
  }
}



interface GetResponseProductCategory { // unwraps the JSON from Spring Data REST _embedded entry

  _embedded: {
    productCategory: ProductCategory[];
  }
}
