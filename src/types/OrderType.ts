import CartType from "./Cart.Type";

export default interface OrderType {
    orderId: number;
    createdAt: string;
    status: string;
    cart: CartType;
}