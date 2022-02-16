import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartItems: CartItem[];

  // A **ReplaySubject** will send out all previous events or messages
  // In this case, every time totalPrice or totalQuantity changes - which will happen with shopping -
  // a new event message is sent to subscribers

  // totalPrice: ReplaySubject<number> = new ReplaySubject<number>();
  // totalQuantity: ReplaySubject<number> = new ReplaySubject<number>();

  // But we just want the last or the latest value - what's the current totalPrice and totalQuantity?
  // I don't care about the 5 values before now
  // So I use **BehaviorSubject** and set initial value to 0
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // Session storage for cart items
  storage: Storage = sessionStorage; // reference to web browser's session storage - access for free
  // Local storage 
  // storage: Storage = localStorage; // reference to local storage on client computer

  constructor() {

    // This now uses the constructor to initialises the cartItems variable.
    // If there is a value in the sessionStorage cartItems value we initialise with that value, 
    // otherwise we initialise to an empty array.
    // The reason for JSON.parse is sessionStorage and localStorage store strings. 
    // So we need to convert the string back into a javascript object equivalent (json).
    this.cartItems = JSON.parse(sessionStorage.getItem('cartItems'))! + null ?
      JSON.parse(sessionStorage.getItem('cartItems')) : [];

    // compute totals based on the data that is read from storage
    this.computeCartTotals();
  }

  // This creates a function which sets the sessionStorage cartItems value with the currentItems variable value.
  // The reason for JSON.stringify is sessionStorage and localStorage store strings. 
  // So this allows us to convert our array into a string equivalent.
  persistCartItems() {
    sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }


  addToCart(theCartItem: CartItem) {

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;


    if (this.cartItems.length > 0) {

      // find the item in the cart based on item id
      // for (let tempCartItem of this.cartItems) {

      //   if (tempCartItem.id === theCartItem.id) {
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }

      // same code as above, 
      // loops through cartItems and returns first element that passes else returns 'undefined'
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);


      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);

    }

    if (alreadyExistsInCart) {
      // increment the quantity
      existingCartItem.quantity++;
    } else {
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();

  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += (currentCartItem.quantity * currentCartItem.unitPrice);
      totalQuantityValue += (currentCartItem.quantity);
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // the .publish() actually sends the event to subscribers

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

    // Every time we manipulate this.cartItems variable 
    // we should update the sessionStorage variable value to reflect this.
    this.persistCartItems();
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    // console.log('Cart Contents: ');

    for (let tempCartItem of this.cartItems) {

      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;

      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, 
                    unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }


    // console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    // console.log('------');
  }


  decrementQuantity(theCartItem: CartItem) {

    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();

    }
  }
  remove(theCartItem: CartItem) {

    // get index of CartItem in the array, if not found itemIndex will return -1
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
}
