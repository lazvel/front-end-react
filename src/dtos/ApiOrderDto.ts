import CartType from "../types/CartType";

export default interface ApiOrderDto {
    orderId: number;
    createdAt: string;
    cartId: number;
    status: "rejected" | "shipped" | "accepted" | "pending";
    cart: CartType;
}