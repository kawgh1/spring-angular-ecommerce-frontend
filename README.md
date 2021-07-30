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


