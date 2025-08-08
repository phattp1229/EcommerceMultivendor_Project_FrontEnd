import type { Order } from "./orderTypes";
import type { Seller } from "./sellerTypes";
import type { Customer } from "./customerTypes";

export interface Transaction {
  id: number;
  customer: Customer;
  order: Order;
  seller: Seller;
  date: string;
}
