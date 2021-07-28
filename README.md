# SpringBoot Angular e-Commerce App

This project was built from a course by Chad Darby at https://www.udemy.com/course/full-stack-angular-spring-boot-tutorial/ . 


This page is the Angular front end. To view the Spring Boot backend please visit https://github.com/kawgh1/spring-angular-ecommerce-app

To view the live site hosted on Heroku please visit https://spring-angular-ecommerce-front.herokuapp.com/products



All of the page sections are Angular components that are populated with data (Product, Product Category, State, Country) from a MySQL database through Spring Data REST JPA calls. 


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
        
        <div *ngIf="firstName.invalid && (firstName.dirty || firstName.touched)" class="alert alert-danger">

            <div *ngIf="firstName.errors.required"> 
                First Name is required 
            </div>

            <div *ngIf="firstName.errors.minLength"> 
                First Name must be at least 2 characters long 
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
