### 8/9/2021 There is some backend issue with Spring and the Web Security Configuration
- I am getting a 404 error when making a purchase, it's acting like the api/checkout/purchase endpoint isn't there when its clearly defined in the CheckoutController
- Could be CORS or CSRF related but nothing seems to work
- Could be Okta related, I've checked Trusted Origin could be a missing backslash "/"

### This is the error I'm getting in browser console
#### General:
- Request URL: https://springboot-angular-ecommerce.herokuapp.com/api/checkout/purchase
- Request Method: POST
- Status Code: 404 
- Referrer Policy: strict-origin-when-cross-origin

#### Response Headers:
- Access-Control-Allow-Credentials: true
- Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With, remember-me
- Access-Control-Allow-Methods: GET, OPTIONS
- Access-Control-Allow-Origin: https://spring-angular-ecommerce-front.herokuapp.com
- Access-Control-Max-Age: 3600
- Connection: keep-alive
- Content-Type: application/json
- Date: Tue, 10 Aug 2021 12:58:19 GMT
- Server: Cowboy
- Transfer-Encoding: chunked
- Vary: Origin
- Vary: Access-Control-Request-Method
- Vary: Access-Control-Request-Headers
- Via: 1.1 vegur

#### Request Headers:
- Accept: application/json, text/plain, */*
- Accept-Encoding: gzip, deflate, br
- Accept-Language: en-US,en;q=0.9
- Connection: keep-alive
- Content-Length: 604
- Content-Type: application/json
- Host: springboot-angular-ecommerce.herokuapp.com
- Origin: https://spring-angular-ecommerce-front.herokuapp.com
- Referer: https://spring-angular-ecommerce-front.herokuapp.com/
- sec-ch-ua: "Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"
- sec-ch-ua-mobile: ?0
- Sec-Fetch-Dest: empty
- Sec-Fetch-Mode: cors
- Sec-Fetch-Site: cross-site

#### Request Payload:  (JSON)
- {customer: {firstName: "asdf", lastName: "asdf", email: "asdf@asdf.com"},…}
- billingAddress: {street: "asdf", city: "asdf", state: "Andhra Pradesh", zipCode: "asdf", country: "India"}
- customer: {firstName: "asdf", lastName: "asdf", email: "asdf@asdf.com"}
- order: {totalPrice: 37.98, totalQuantity: 2}
- orderItems: [{imageUrl: "assets/images/products/coffeemugs/coffeemug-luv2code-1000.png", quantity: 1,…},…]
- shippingAddress: {street: "asdf", city: "asdf", state: "Andhra Pradesh", zipCode: "asdf", country: "India"}


# SpringBoot Angular e-Commerce App

- This project was built based on a course by **[Chad Darby](https://www.udemy.com/course/full-stack-angular-spring-boot-tutorial/)**

- This page is the Angular front end. 
    - To view the **Spring Boot backend** please click **[here](https://github.com/kawgh1/spring-angular-ecommerce-app)**
    - To view the **live site** hosted on Heroku please click **[here](https://spring-angular-ecommerce-front.herokuapp.com/products)**
    - **Additional functionality may be accessed by logging in with the test account**
        - **username: "test@test.com"**
        - **password: "techtonics"**

        - More info on enabling Okta user registration on applications **[here](https://developer.okta.com/docs/guides/set-up-self-service-registration/configure-self-service-registration-policy)**


All of the page sections are Angular components that are populated with data (Product, Product Category, etc) from a MySQL database through Spring Data REST JPA calls. 

### My additions are responsive product display (CSS Grid), responsive mobile view and development, custom icons, navigation and style as well as deployment to heroku and SQL database setup.

The course and deployment were a lot of fun. I look forward to creating more Angular/React + SpringBoot applications.


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## 8/1/2021 Update

## [Table of Contents](#table-of-contents)
1. [Problem - Handling Stored Data and Browser Refresh](#problem---handling-stored-data-and-browser-refresh)
2. [Okta Integration](#okta-integration)
3. [Form Validation](#form-validation)
4. [Save the Order](#save-the-order)
5. [Order History](#order-history)
6. [Secure Order History](#secure-order-history)
7. [Secure Communication](#secure-communication)
8. [Publishing events - messages](#publishing-messages---events)


![CartService Diagram](https://github.com/kawgh1/spring-angular-ecommerce-frontend/blob/master/src/assets/images/CartServiceDiagram.png)



# [Problem - Handling Stored Data and Browser Refresh](#problem---handling-stored-data-and-browser-refresh)
- Possible solutions
    - Keep track of cart products using client side browser web storage
    - HTML5 introduced **Web Storage API**
        - store data in the browser using key/value pairs


### Two types of Web Storage
- **Session Storage**
    - Data is stored in web browser's memory
        - Browser session means Web browser client-side memory
            - Nothing is sent to the server
            - Nothing to do with Backend HttpSession
    - Each web browser tab has it's own "session"
        - Data is not shared between web browser tabs
        - Once a web browser tab is closed then that data is forgotten and no longer available
- **Local Storage**
    - Data is stored on the client side computer
        - Data is never sent to the server
    - Data is available to tabs of the same web browser for same origin - called **Data Scoping**
        - i.e. - data from a browser tab open to cnn.com cannot read data from another tab open to apple.com
        - Likewise browsers cannot access local storage data of another browser (Firefox cannot access data in Chrome)
        - App must read data again ... normally with a browser refresh
        - Data persists even if web browser is closed
        - Can clear the data using JavaScript or clearing web browser cache
- **Data Scoping**
    - Data is scoped to a given origin
        - Origin: **protocol + hostname + port**
        - Same origin: http://localhost:4200 == http://localhost:4200
        - Different origin: http://localhost:4200 != http://localhost:8080
- **Factors to consider**
    - Data in web storage is stored in **plain text** ... NOT encrypted
    - Do not use it to store any sensitive info such as personal info or credit card info etc.
    - Be aware that power users may tinker with files
    - You app should be resilient to still work if storage is not available
        - the user may clear their browser cache etc
        - Your app should use reasonable defaults

### Web Storage API
- The API works the same for Session Storage and Local Storage
    - Based on key value pairs
    - Keys and values are always strings
- Remember data is scoped to page origin: **protocol + hostname + port**
    - Store items using: storage.setItem(key, value)
    - Retrieve items using: storage.getItem(key)
    - Remove items using: storage.removeItem(key)
    - Clear all stored data using: storage.clear()

### Development Process - Angular
1. Update CartService to read data from **Session storage**

    File: cart.service.ts

        export class CartService {
            cartItems: CartItem[] = [];
            ...

            storage : Storage = sessionStorage; // reference to web browser's session storage

            constructor() {
                // read data from storage
                let data = JSON.parse(this.storage.getItem('cartItems'));

                if (data != null) {
                    this.cartItems = data;

                    // compute totals based on the data that is read from storage
                    this.computeCartTotals();
                }
            }
        }
2. Add new method in CartService: persistCartItems()

    
    File: cart.service.ts

        export class CartService {
            cartItems: cartItem[] = [];
            ...

            storage : Storage = sessionStorage;

            persistCartItems() {
                this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
            }
3. Modify computeCartTotals() to call new method: persistCartItems()

     
    File: cart.service.ts

        export class CartService {
            cartItems: cartItem[] = [];
            ...

            storage : Storage = sessionStorage;

            persistCartItems() {
                this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
            }

            computeCartTotals() {
                ...
                ...

                // persist cart data
                this.persistCartItems();
            }


[Top](#table-of-contents)

# [Okta Integration](#okta-integration)
For more background info on Okta, Oauth 2, OpenID Connect, JWT, etc. please visit the backend notes [here](https://github.com/kawgh1/spring-angular-ecommerce-app)

Oauth updates
https://auth0.com/blog/browser-behavior-changes-what-developers-need-to-know/


SameSite Cookies explained
https://web.dev/samesite-cookies-explained/

## Problem using Okta encountered in development
- ### Using Okta for authentication and application sign-in and redirect uses COOKIES
    - **If you have 'Third Party Cookies' disabled** or are using an **'Incognito'** or **'Private'** browser window, the Okta Sign-in Widget **WILL** stall indefinitely
## Okta Development Process - Angular
### 1. Create a free developer account at okta.com
- **visit http://developer.okta.com**
- sign up for free account
### 2. Add OpenID Connect client app in Okta
- In your Okta Developer Account
    - Create a new application
    - Select option for **Single-Page Application** (like Angular, React, etc.)
### 3. Set up app configuration for OpenID Connect
- To connect with Okta, need to provide configs
- Need the **clientId** (public identifier of the client app) and 
- **issuer** ... available on Okta application details screen under General Settings
    - the **issuer** is the **issuer of tokens**, a unique domain that is setup for your developer account
        - **ex.) https://${yourOktaDomain}/oauth2/default**
        - This is the URL the application will use for tokens

    - Code:
        - **clientId** - public identifier of client app
        - **issuer** - developer domain, URL used when authorizing with Okta authorization server 
        - **redirectUri** - once user logs in successfully, send them here
        - **scopes** - OpenID Connect uses pre-configured scopes to determine  what precisely can be used for user authorization / authentication



    File: my-app-config.ts

        export default {
            oidc: {
                clientId: 'asd987sad98f',
                issuer: 'https://dev-12123.okta.com/oauth2/default',
                redirectUri: 'http:localhost:4200/login/callback',
                scopes: ['openid', 'profile', 'email']
            }
        }

### 4. Install Okta SDK dependencies
- We will use two Okta SDK dependencies
    - Okta Sign-In Widget
        - Okta Sign-In Widget is a JavaScript library for application login
        - You dont have to create the HTML ... just integrate the widget into your application
        - Customizable ... can use your own logo, field names and custom fields
    - Okta Angular SDK
        - Okta Angular SDK provides **integration with Angular Router** for authentication and authorization
        - Core Features:
            - Login/ logout from Okta using OAuth 2.0 API
            - Retrieve user information and determine authentication status
        - Additional Features:
            - Add protected routes that require authentication
            - Subscribe to changes in authentication state
    - Install
        - **$ npm install @okta/okta-sign-widget**
        - **$ npm install @okta/okta-angular**
### 5. Integrate Okta Sign-In Widget on our site / application
- Add reference for okta sin in CSS



        File: angular.json

        ...
        "styles": [
            "src/styles.css",
            "node_modules/bootstrap/dist/css/bootstrap.min.css",
            "node_modules/@fontawesome/fontawesome-free/css/all.min.css",
            "node_modules/@okta/okta-signin-widget/dist/css/okta-sign-in.min.css"
        ],
        ...
- generate a login component using the Angular CLI ng generate component
    - **$ ng generate component components/login**

- in our login.component.html file create a div container to inject the Okta Sign-in Widget



        File: login.component.html

        ...
        <!-- Container to inject the Okta Sign-In Widget -->
        <div class="pt-5">
            <div id="okta-sign-in-widget" class="pt-5"></div>
        </div>
        ...
- write the code that will handle the widget and sign in operation in login.component.ts

- Authorization Code Flow with PKCE
    - Proof Key for Code Exchange (PKCE)
    - This is the **recommended** approach for controlling access between client app and the auth server
    - Protects against Authorization Code Intercept attacks
    - Introduces concept of **dynamic secrets** 
        - Proof Key for Code Exchange (PKCE) instead of a client secret. A one-time key is generated by the client and sent with each request. Instead of proving the identity of a client, this ensures that only the client which requested the token can redeem it.
        - Implemented with a code verifier, code challenge and method
        - More info: https://developer.okta.com/docs/guides/implement-auth-code-pkce/overview/
### 6. Develop "Login Status" Component for login / logout buttons
- Basically creating the UI for "Login" and "Logout" buttons and functionality


    File: login-status.component.html

        <div class="login-status-header">

            <div *ngIf="isAuthenticated && userFullName" class="login-status-user-info">
                Welcome back {{ userFullName }}!
            </div>
        
            <button *ngIf="!isAuthenticated" routerLink="/login" class="security-btn">
                Login
            </button>

            <button *ngIf="isAuthenticated" (click)="logout" class="security-btn">
                Logout
            </button>

        </div>
    ...

- **$ ng generate component components/LoginStatus**
- write code in login-status.components.ts
    - here we will inject the oktaAuthService into the component constructor
    - and subscribe to authentication state changes
    - Logout will terminate the session with Okta and remove any current tokens

- add login-status-component in the main app.component.html file to display it on the page


    File: app.component.html

      <!-- PAGE CONTAINER-->
        <div class="page-container">
            <!-- HEADER DESKTOP-->
            <header class="header-desktop">
            <div class="section-content section-content-p30">
                <div class="container-fluid">
                <div class="header-wrap">

                    <app-search></app-search>

                    <app-login-status></app-login-status>

                    <app-cart-status></app-cart-status>

        ...

### 7. Update App Module configs to connect routes
- Update our app module configs to enable the routes by injecting the Router


File: app.module.ts

    ...
    import {
        OKTA_CONFIG,
        OktaAuthModule,
        OktaCallbackComponent
    } from '@okta/okta-angular';

    import myAppConfig from './config/my-app-config';

    const oktaConfig = Object.assign({
        onAuthRequired: (injector) => {
            const router = injector.get(Router);

            // Redirect the user to custom login page
            router.navigate(['/login]);
        }
    }, myAppConfig.oidc);

    const routes: Routes = [
        {path: 'login/callback', component: OktaCallbackComponent },
        {path: 'login', component: LoginComponent },
        ...
    ]
    ...
- Once the user is authenticated, they are redirected to your client application / site
    - Normally you would need to parse the response and store the OAuth + OIDC tokens
        - However, the **OktaCallbackComponent** handles this for you

- Update our app module configs imports


File: app.module.ts
    ...
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        HttpClientModule,
        NgbModule,
        ReactiveFormsModule,
        OktaAuthModule  <--
    ],
    provides: [ProductService, { provide: OKTA_CONFIG, useValue: oktaConfig }
    ]
    ...

- Documentation for Okta Components
    - Okta Sign-In Widget
        - https://github.com/okta/okta-signin-widget
    - Okta Angular SDK
        - https://github.com/okta/okta-angular


[Top](#table-of-contents)

- ## [Form Validation](#form-validation)
    - Added Form Validation in the Checkout Form using Angular [FormControl](https://angular.io/api/forms/FormControl)

    - Only display validation errors if the user has interacted with the form - if the form is 'dirty' (user changed data) or 'touched' (user selected field)

    - When the field loses focus, the control is marked as "touched"



    File: checkout.component.html

        <label>First Name</label>
        <input formControlName="firstName" type="text">

        <!-- validator method dirty=did user change field value, touched=did user change fields -->

        <!-- if text field is invalid, dirty or touched, 
        then display div alert box with message to correct field -->

        <div *ngIf="firstName.invalid && (firstName.dirty || firstName.touched)"
            class="alert alert-danger mt-1">

            <!-- notOnlyWhiteSpace is a custom validator -->
            <div *ngIf="firstName.errors.required || firstName.errors.notOnlyWhiteSpace">
                First Name is required
            </div>

            <div *ngIf="firstName.errors.minlength">
                First Name must be at least 2 characters
            </div>

        </div>

        ...

        File: checkout.component.ts

        onSubmit() {
            console.log("Handling the submit button");
            ...
            if (this.checkoutFormGroup.invalid) {
                this.checkoutFormGroup.markAllAsTouched();
            }

            console.log("CheckoutFormGroup is valid: " + this.checkoutFormGroup.valid);
        }

- Added custom form validator for 'notOnlyWhiteSpace' in app/components/validators/tech-tonic-validators.ts

[Top](#table-of-contents)

- ## [Save the Order](#save-the-order) 
    - Send the order from the Angular frontend  to the Spring Boot backend through the REST API and store it in the database
    - For saving the order, in the Spring Boot backend we will create a custom Controller and Service
        - **CheckoutController**
        - **CheckoutService**

    - We'll use a **Data Transfer Object (DTO)** called 'Purchase' that will store the data for each order
        - PurchaseDTO
            - Customer
            - Shipping Address
            - Billing Address
            - Order
            - OrderItems[]
            - ...

        - JSON object<br/>
{<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;**"customer"**:{<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**"firstName"**:"Nancy",<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**"lastName"**:"Smith",<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**"email"**:"nancy.smith@techtonics.com"<br/>
    },<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;**"shippingAddress"**:{<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**...**<br/>
    },<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;**"billingAddress"**:{<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**...**<br/>
    },<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;**"order"**:{<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**"totalPrice"**:36.98,<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**"totalQuantity"**:2<br/>
    },<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;**"orderItems"**:[<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**"imageUrl"**:"assets/images/products/coffeemugs/coffeemug-luv2code-1000.png",<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**"quantity"**:1,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**"unitPrice"**:18.99,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**"productId"**:26<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**"imageUrl"**:"assets/images/products/mousepads/mousepad-luv2code-1000.png",<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**"quantity"**:2,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**"unitPrice"**:17.99,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**"productId"**:51<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>
    &nbsp;&nbsp;&nbsp;&nbsp;]<br/>
}<br/>

        - And use this DTO (using **JSON** object) to transfer the data between the Angular front-end and the Spring Boot back-end
    
    - **REST API**
        - Support the POST method for checkout purchase
        - Request body contains JSON for PurchaseDTO
            - **POST** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  /api/checkout/purchase &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    *new purchase order*
    
    - ## ***Why not use Spring Data REST??***

        - ### Spring Data REST is great for basic CRUD operations
            - We are currently using it for our product catalog to receive images and information for each product to display
    
        - However, Spring Data REST is **NOT** the best for processing operations that involve ***custom business logic***
            - Generate a unique tracking number
            - Save order in database
            - Other custom business logic...

        - Spring Data REST is very limited in terms of customization
            - For custom business logic and processing, create a custom controller and service on the backend

![Database Diagram](https://github.com/kawgh1/spring-angular-ecommerce-frontend/blob/master/src/assets/images/DatabaseDiagram.png)


### Save the Order - Development Process
- Development Process for saving the customer order from the Angular front end to the Spring Boot back end
### 1. Create common classes
    - **Customer, Order, OrderItem, Address, Purchase**
### 2. Create CheckoutService
    - Make REST API call to Spring Boot backend
### 3. Update CheckoutComponent
    - Inject CheckoutService and Router
    - Update onSubmit() method to collect form data, call CheckoutService


Purchase method when user clicks "Submit" order on checkout screen

    
        File: checkout.component.ts
        
        ...
        
        onSubmit() {

            // logging

            console.log("Handling the submit button");

            if (this.checkoutFormGroup.invalid) {
            this.checkoutFormGroup.markAllAsTouched();
            return;
            }
            
            // set up order
            // new order instance
            let order = new Order();
            order.totalPrice = this.totalPrice;
            order.totalQuantity = this.totalQuantity;

            // get cart items
            const cartItems = this.cartService.cartItems;

            // create orderItems from cartItems
            // - long way - for loop
            // let orderItems: OrderItem[] = [];
            // for (let i = 0; i < cartItems.length; i++) {
            //   orderItems[i] = new OrderItem(cartItems[i]);
            // }

            // - short way - mapping
            let orderItemsShort: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

            // set up purchase object
            let purchase = new Purchase();

            // populate purchase - customer
            purchase.customer = this.checkoutFormGroup.controls['customer'].value;


            // populate purchase - shipping address
            purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
            const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state))
            const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country))
            purchase.shippingAddress.state = shippingState.name;
            purchase.shippingAddress.country = shippingCountry.name;

            // populate purchase - billing address
            purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
            const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state))
            const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country))
            purchase.billingAddress.state = billingState.name;
            purchase.billingAddress.country = billingCountry.name;

            // populate purchase - order and orderItems
            purchase.order = order;
            purchase.orderItems = orderItemsShort;


            // call REST API via the CheckoutService
            this.checkoutService.placeOrder(purchase).subscribe({
            // next is the success/ happy path
            next: response => {
                // here we are generating an alert that is grabbing the newly created tracking number from the Spring backend through JSON
                alert(`Your order has been received. \nOrder tracking number: ${response.orderTrackingNumber}`)

                // reset the cart
                this.resetCart();

            },
            // error is the error/ exception handling path
            error: err => {
                alert(`There was an error: ${err.message}`);
            }
            }
            )
        }

        resetCart() {
            // reset cart data
            // set cartItems array to an empty array, clears it out
            this.cartService.cartItems = [];
            // set next on cartService properties to send out the new value (0) to all subscribers
            this.cartService.totalPrice.next(0);
            this.cartService.totalQuantity.next(0);

            // reset form data
            this.checkoutFormGroup.reset();

            // navigate back to the main products page
            // router was injected in the constructor
            this.router.navigateByUrl("/products");
        }

[Top](#table-of-contents)

## [Order History](#order-history)
- ## Development Process**

### 1. Keep track of logged in user's email with web browser storage
- Since we know we will need to retrieve the user's email, let's store it in the web browser session storage

    File: login-status.component.ts

        export class LoginStatusComponent implements OnInit {
            ...
            storage: Storage = sessionStorage;
            ...

            getUserDetails() {
                if (this.isAuthenticated) {
                    // fetch the logged in user details (user's claims)
                    this.oktaAuthService.getUser().then(
                        (res) => {
                            this.userFullName = res.name;

                            // retrieve user's email from Okta authentication response
                            const theEmail = res.email;

                            // now store the email in browser storage
                            this.storage.setItem('userEmail', JSON.stringify(theEmail));
                        }
                    );
                }
            }
        }


### 2. Create OrderHistory class
- **$ ng generate class common/OrderHistory**

    File: order-history.ts

        export class OrderHistory {
            id: string;
            orderTrackingNumber: string;
            totalPrice: number;
            totalQuantity: number;
            dateCreated: Date;
        }

### 3. Develop OrderHistory service
- **$ ng generate service services/OrderHistory**

    File: order-history.service.ts

        export class OrderHistoryService {
            private orderUrl = 'http://localhost:8080/api/orders';

            constructor(private httpClient: HttpClient) { }

            getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {

                // need to build URL based on the customer email
                const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmail?email=${theEmail}`; // call the REST API

                return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl); // unwraps the JSON from Spring Data REST _embedded entry
            }
        }

        interface GetResponseOrderHistory {
            _embedded: {
                orders: OrderHistory[];
            }
        }


### 4. Generate order-history component
- **# ng generate component components/OrderHistory**

    File order-history.component.ts

        export class OrderHistory Component implements OnInit {

            orderHistoryList: OrderHistory[];
            storage: Storage = sessionStorage;

            constructor(private orderHistoryService: OrderHistoryService) { } // inject OrderHistoryService

            ngOnInit(): void {
                this.handleOrderHistory();
            }

            handleOrderHistory() {
                // read the user's email address from browser storage
                const theEmail = JSON.parse(this.storage.getItem('userEmail'));

                // retrieve data from the service
                this.orderHistoryService.getOrderHistory(theEmail).subscribe(
                    data => {
                        this.orderHistoryList = data._embedded.orders; // assign data
                    }
                )
            }
        }

### 5. Update template text in HTML page

- make an HTML table to display customer orders in order-history.component.html
    
### 6. Add "Orders" button to login-status component
    
### 7. Define protected route for order-history component
    
File: app.module.ts

    const routes: Routes = [

        {path: 'order-history', component: OrderHistoryComponent, canActivate: [ OktaAuthGuard ]}; // Route Guard
    ]
        
[Top](#table-of-contents)

#### [Secure Order History](#secure-order-history)
- #### Development Process
- The REST API for /api/orders has been secured on the backend
- Now we need to update the Angular app to pass the access token to the Backend SpringBoot Resource Server so users can access the orders API and view their orders
- Client (Angular app) sends the access token as an HTTP request header
    - Authorization: Bearer <token>
- We will use **Angular Interceptors** to modify the Angular Http request and add the access token
1. Create an interceptor
    - Develop the interceptor as a service
    - **$ ng generate service services/AuthInterceptor**

    File: auth-interceptor.service.ts

        ...
        export class AuthInterceptorService implements HttpInterceptor {

            constructor(private oktaAuth: OktaAuthService) {} //inject OktaAuthService into the interceptor

            // implement the interceptor Angular interface method intercept()
            // this will basically intercept all outgoing Http requests of HttpClient
            intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
                return from(this.handleAccess(request, next));

            }

            // helper method
            private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

                // Only add an access token when authenticated user is requesting a secured endpoint
                const securedEndpoints = ['http://localhost:8080/api/orders'];

                if (securedEndpoints.some(url => requests.urlWithParams.includes(url))) {

                    // get access token
                    const accessToken = await this.oktaAuth.getAccessToken(); // await waits for the async getAccessToken() call to finish

                    // clone the request (which is immutable) and add new header with access token
                    request = request.clone({
                        setHeaders: {
                            Authorization: 'Bearer' + accessToken
                        }
                    });

                }

                // pass the new request to the next interceptor in the chain
                return next.handle(request).toPromise();
            }
        }


2. Update app.module.ts to reference interceptor

    File: app.module.ts

        ...
        @NgModule({
            
            declarations: [...]

            imports: [...]

            // Token for interceptors, 
            // Register our AuthInterceptor as an HTTP interceptor, 
            // Informs Angular that HTTP_INTERCEPTORS is a token for injecting an array of values
            **providers:** [ProductService, {provide: OKTA_CONFIG, useValue: oktaConfig},
                            **{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}**],
        })
        ...

    - [Additional Resources](https://github.com/darbyluv2code/fullstack-angular-and-springboot/blob/master/bonus-content/angular-additional-resources.md)

[Top](#table-of-contents)

#### [Secure Communication](#secure-communication)
- Since we are dealing with personal and credit card information, we want it to be secure (ie encrypted)
- Therefore we want to make sure we are using HTTPS and not HTTP
    - HTTPS uses TLS
    - no source code changes required, simply configure your backend server to run using secure keys and certificate
    - Then access the site with https://localhost:4200
- **Keys and Certificates**
    - To run securely, you need keys and certificates
        - Provides proof of your server's identity (domain name) - that you are who you say you are
        - Reviewed and signed by a trusted third party certificate authority (godaddy, verisign, etc.)
        - In real world, you have to pay for certificates
            - For Dev/Demo purposes we will use a self-signed certificate
            - Because a self-signed certificate is not verified the browser will give warnings
- #### Development Process


[Top](#table-of-contents)

### [Publishing messages - events](#publishing-messages---events)
- **Cart Service**

- Recall that we send messages/events to other components within our application
- For Example, CartStatusComponent will **subscribe** to the CartService
    - CartService will **publish** messages for:
        - totalPrice
        - totalQuantity

**[CartService Diagram](https://github.com/kawgh1/spring-angular-ecommerce-frontend/blob/master/src/assets/images/CartServiceComponentDiagram.png)**
1. **CartStatusComponent subscribes** to **CartService** for events
2. **ProductListComponent** sends data (items added to cart) to Cart Service to **publish** event
3. **Cart Service** publishes events to all subscribers
4. **CartStatusComponent** receives event and updates display for total price and quantity

![Subject Without Replay Diagram](https://github.com/kawgh1/spring-angular-ecommerce-frontend/blob/master/src/assets/images/SubjectWithoutReplayDiagram.png)
- Publish / Subscribe
    - Similar approach for **CheckoutComponent** ... almost
    - **CheckoutComponent** will subscribe to events from **CartService**
    - However, since **CheckoutComponent** is instantiated later in the application
        - Thus, it will miss out on previous messages
    - As a result, **CheckoutComponent** cart totals will erroneously show as
        - 0 for total quantity
        - 0.00 for total price

![ReplaySubject Diagram](https://github.com/kawgh1/spring-angular-ecommerce-frontend/blob/master/src/assets/images/ReplaySubjectDiagram.png)
- Use of ReplaySubject
    - Subject is used to send events to subscribers
    - ReplaySubject is a subclass of Subject
        - Will also "replay events" for new subscribers who join later on
        - Keeps a buffer of previous events ... and send to **new subscribers**

[More info on ReplaySubject](https://rxjs-dev.firebaseapp.com/guide/subject#replaysubject)


#### BehaviorSubject
- **BehaviorSubject** is a subclass of Subject
    - Has a notion of "current value" or "last value"
    - **Stores the latest message / event only** ... and sends to new subscribers
        - *Sorry I'm late to the meeting - what's the latest cart total?*
        - Instead of, what's every message/event since the meeting started?

    - From the Docs
        - **BehaviorSubjects** are useful for representing "values over time"
        - For example, an event stream of birthdays is a **Subject**, but the stream of a person's age would be a **BehaviorSubject**


[Top](#table-of-contents)