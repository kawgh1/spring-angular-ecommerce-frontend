import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  // set up purchaseUrl - Url to the Spring Boot backend
  // private purchaseUrl = 'http://localhost:8080/api/checkout/purchase' // development
  private purchaseUrl = 'https://springboot-angular-ecommerce.herokuapp.com/api/checkout/purchase' // production


  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any> {

    // here we are POSTing the purchase object to the backend Url
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
