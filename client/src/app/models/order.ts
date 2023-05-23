import { ICartItem } from './cart-item';

export interface IOrder {
    menu: ICartItem[];
    hotel: string;
    amountPaid: number;
    orderDate: Date;
}
