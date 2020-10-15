import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';

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




  constructor(private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: CartService) { }





  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({

      customer: this.formBuilder.group({

        // firstName: [''],
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        // lastName: [''],
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        // email: ['']
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),

      shippingAddress: this.formBuilder.group({

        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
      }),

      billingAddress: this.formBuilder.group({

        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
      }),

      creditCard: this.formBuilder.group({

        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });




    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(

      data => {

        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );



    // populate credit card years
    this.shopFormService.getCreditCardYears().subscribe(

      data => {

        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );



    // populate countries from JPA when form is initially displayed
    this.shopFormService.getCountries().subscribe(

      // data rec'd back from API
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));

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

  reviewCartDetails() {

    this.cartService.totalQuantity.subscribe(

      totalQuantity => this.totalQuantity = totalQuantity

    );

    this.cartService.totalPrice.subscribe(

      totalPrice => this.totalPrice = totalPrice

    );

  }



  onSubmit() {

    // logging

    console.log("handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);

    console.log("The customer email address is " + this.checkoutFormGroup.get('customer').value.email);

    console.log("The customer shipping state is " + this.checkoutFormGroup.get('shippingAddress').value.state);
    console.log("The customer shipping country is " + this.checkoutFormGroup.get('shippingAddress').value.country);

    // show "added to cart" message when clicked on product card
    document.getElementById("alert-purchase").hidden = false;
    setTimeout(() => {
      document.getElementById("alert-purchase").hidden = true;
    }, 10000);
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

