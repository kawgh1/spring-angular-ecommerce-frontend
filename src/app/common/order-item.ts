import { CartItem } from "./cart-item";

export class OrderItem {
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    productId: string;

    // we'd like to be able to construct an OrderItem based off of CartItem
    constructor(cartItem: CartItem) {

        // assign properties of CartItem to this OrderItem since its a different object
        // we'll use this when making our purchase order in Checkout to send to the backend
        this.imageUrl = cartItem.imageUrl;
        this.quantity = cartItem.quantity;
        this.unitPrice = cartItem.unitPrice;
        this.productId = cartItem.id;
    }
}
