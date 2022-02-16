import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthInterceptorService implements HttpInterceptor {

  constructor(private oktaAuth: OktaAuthService) { }

  // implement the interceptor Angular interface method intercept()
  // this will basically intercept all outgoing Http requests of HttpClient
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));

  }

  // helper method
  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

    // Only add an access token when authenticated user is requesting a secured endpoint
    // DEV 
    // const securedEndpoints = ['http://localhost:8080/api/orders'];
    // PROD
    const securedEndpoints = ['https://springboot-angular-ecommerce.herokuapp.com/api/orders'];

    if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {

      // get access token
      const accessToken = await this.oktaAuth.getAccessToken(); // await waits for the async getAccessToken() call to finish

      // clone the request (which is immutable) and add new header with access token
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });

    }

    // pass the new request to the next interceptor in the chain
    return next.handle(request).toPromise();
  }
}