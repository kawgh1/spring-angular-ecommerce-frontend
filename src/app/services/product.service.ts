import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = "http://localhost:8080/api/products"; // hardcoded

  constructor(private httpClient: HttpClient) { }

  // returns an Observable, maps the JSON data from Spring Data REST into a Product array
  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build URL based on category id

    // Since Spring Data REST in the Product Repository class automatically exposes 
    // this endpoint -> "http://localhost:8080/api/products/search/findByCategoryId"

    // so we build a dynamic search Url that takes in the user's click/input (as category id)

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    // return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );

  }

}

interface GetResponse { // unwraps the JSON from Spring Data REST _embedded entry

  _embedded: {
    products: Product[];
  }
}
