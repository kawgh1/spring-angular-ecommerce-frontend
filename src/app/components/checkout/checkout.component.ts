import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { TechTonicValidators } from 'src/app/validators/tech-tonic-validators'
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  //countries
  countries: Country[] = [];


  // need 2 separate states array for shipping and billing
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;


  // constructor(private formBuilder: FormBuilder,
  //   private shopFormService: ShopFormService,
  //   private cartService: CartService) { }

  // adding CheckoutService and Router for purchasing orders, sending to backend
  constructor(private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) { }





  ngOnInit(): void {

    // this.reviewCartDetails();

    // read the user's email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));



    this.checkoutFormGroup = this.formBuilder.group({

      customer: this.formBuilder.group({

        // firstName: [''],
        // lastName: [''],
        // email: ['']
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2), TechTonicValidators.notOnlyWhiteSpace]),

        lastName: new FormControl('', [Validators.required, Validators.minLength(2), TechTonicValidators.notOnlyWhiteSpace]),

        email: new FormControl(theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), TechTonicValidators.notOnlyWhiteSpace])
      }),

      shippingAddress: this.formBuilder.group({

        // street: [''],
        // city: [''],
        // state: [''],
        // zipCode: [''],
        // country: ['']
        street: new FormControl('',
          [Validators.required, Validators.minLength(2), TechTonicValidators.notOnlyWhiteSpace]),
        city: new FormControl('',
          [Validators.required, Validators.minLength(2), TechTonicValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required, Validators.minLength(2), TechTonicValidators.notOnlyWhiteSpace]),
        country: new FormControl('', [Validators.required])
      }),

      billingAddress: this.formBuilder.group({

        // street: [''],
        // city: [''],
        // state: [''],
        // zipCode: [''],
        // country: ['']
        street: new FormControl('',
          [Validators.required, Validators.minLength(2), TechTonicValidators.notOnlyWhiteSpace]),
        city: new FormControl('',
          [Validators.required, Validators.minLength(2), TechTonicValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required, Validators.minLength(2), TechTonicValidators.notOnlyWhiteSpace]),
        country: new FormControl('', [Validators.required])
      }),

      creditCard: this.formBuilder.group({

        // cardType: [''],
        // nameOnCard: [''],
        // cardNumber: [''],
        // securityCode: [''],
        // expirationMonth: [''],
        // expirationYear: ['']

        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('',
          [Validators.required, Validators.minLength(2), TechTonicValidators.notOnlyWhiteSpace]),
        // there are algorithms that run a checksum on the credit card number to determine if AMEX, VISA, Mastercard, etc. - not here
        cardNumber: new FormControl('',
          [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',
          [Validators.required, Validators.pattern('[0-9]{3,4}')]),
        // expirationMonth and Year are already auto-populated in other coding logic
        expirationMonth: [''],
        expirationYear: ['']
      })
    });




    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    // console.log("startMonth: " + startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(

      data => {

        // console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );



    // populate credit card years
    this.shopFormService.getCreditCardYears().subscribe(

      data => {

        // console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );



    // populate countries from JPA when form is initially displayed
    this.shopFormService.getCountries().subscribe(

      // data rec'd back from API
      data => {
        // console.log("Retrieved countries: " + JSON.stringify(data));

        // set checkout component property 'countries' to = the returned countries API data
        this.countries = data;
      }
    );

    // populate totalPrice and totalQuantity
    this.reviewCartDetails();
  }

  // validation methods used in checkout.component.html
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }


  reviewCartDetails() {

    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(

      // assign that value to this component's totalQuantity variable
      totalQuantity => this.totalQuantity = totalQuantity

    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(

      // assign that value to this component's totalPrice variable
      totalPrice => this.totalPrice = totalPrice

    );

  }



  onSubmit() {

    // logging

    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    // console.log(this.checkoutFormGroup.get('customer').value);

    // console.log("The customer email address is " + this.checkoutFormGroup.get('customer').value.email);

    // console.log("The customer shipping state is " + this.checkoutFormGroup.get('shippingAddress').value.state);
    // console.log("The customer shipping country is " + this.checkoutFormGroup.get('shippingAddress').value.country);

    // show "added to cart" message when clicked on product card
    // document.getElementById("alert-purchase").hidden = false;
    // setTimeout(() => {
    //   document.getElementById("alert-purchase").hidden = true;
    // }, 10000);

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
    );
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




  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {

      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      // bug fix code for billing state not updating when 'same as shipping address' selected
      this.billingAddressStates = this.shippingAddressStates;

    }
    else {

      this.checkoutFormGroup.controls.billingAddress.reset();

      // bug fix code for billing states
      this.billingAddressStates = [];
    }

  }







  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if current year equals selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {

      startMonth = new Date().getMonth() + 1;
    }
    else {

      startMonth = 1; // January for any other year than current year
    }

    // get the data from shopFormService
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(

      data => {

        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }




  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    // the API only requires the country code "IN", "CA" to return states
    // http://localhost:8080/api/states/search/findByCountryCode?code=DE

    // returning the name here for future debugging purposes

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);


    this.shopFormService.getStates(countryCode).subscribe(

      data => {

        if (formGroupName === 'shippingAddress') {

          this.shippingAddressStates = data;

        }
        else {

          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }
}

