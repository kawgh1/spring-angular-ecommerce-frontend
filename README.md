# SpringBoot Angular e-Commerce App

This project was built from a course by Chad Darby at https://www.udemy.com/course/full-stack-angular-spring-boot-tutorial/ . 


This page is the Angular front end. To view the Spring Boot backend please visit https://github.com/kawgh1/spring-angular-ecommerce-app

To view the live site hosted on Heroku please visit https://spring-angular-ecommerce-front.herokuapp.com/products



All of the page sections are Angular components that are populated with data (Product, Product Category, State, Country) from a MySQL database through Spring Data REST JPA calls. 

![CartService Diagram](https://github.com/kawgh1/spring-angular-ecommerce-frontend/blob/master/src/assets/images/CartServiceDiagram.png)


### My additions are responsive product display (CSS Grid), mobile view and development, custom icons and style as well as deployment to heroku and database setup.


For the backend I did the heroku deployment including MySQL database set up.

The course and deployment were a lot of fun. I look forward to creating more Angular/React + SpringBoot applications.


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### 8/1/2021 Update

- Added Form Validation in the Checkout Form using Angular [FormControl](https://angular.io/api/forms/FormControl)

    - Only display validation errors if the user has interacted with the form - if the form is 'dirty' (user changed data) or 'touched' (user selected field)

    - When the field loses focus, the control is marked as "touched"


    Ex)

        File: checkout.component.html

        <label>First Name</label>
        <input formControlName="firstName" type="text">

        <!-- validator method dirty=did user change field value, touched=did user change fields -->

        <!-- if text field is invalid, dirty or touched, then display div alert box with message to correct field -->

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

- ## Save the Order 
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
1. Create common classes
    - Customer, Order, OrderItem, Address, Purchase
2. Create CheckoutService
    - Make REST API call to Spring Boot backend
3. Update CheckoutComponent
    - Inject CheckoutService and Router
    - Update onSubmit() method to collect form data, call CheckoutService


Purchase method when user clicks "Submit" order on checkout screen

    Ex)
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

### Cart Service - Publishing messages/events

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


