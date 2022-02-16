import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  // define OrderUrl - the endpoint to our Spring Data REST API
  // private orderUrl = 'http://localhost:8080/api/orders'; // DEV
  private orderUrl = 'https://springboot-angular-ecommerce.herokuapp.com/api/orders'; // PROD


  // inject HttpClient into constructor to use for making REST API calls
  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {

    // need to build the URL based on the customer's email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[]; //Unwraps the JSON from Spring Data REST _embedded entry and maps those to an array of embedded Order History items
  }
}
