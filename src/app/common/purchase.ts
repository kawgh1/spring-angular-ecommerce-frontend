import { Address } from "./address"
import { Customer } from "./customer"
import { Order } from "./order"
import { OrderItem } from "./order-item";

export class Purchase {

    // Purchase object
    // - Customer
    // - Shipping Address
    // - Billing Address
    // - Order
    // - OrderItem[...]

    customer: Customer;
    shippingAddress: Address;
    billingAddress: Address;
    order: Order;
    orderItems: OrderItem[];
}
