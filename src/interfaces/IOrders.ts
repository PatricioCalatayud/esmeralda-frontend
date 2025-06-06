export interface IOrders {
    id:            string;
    trackingNumber: string;
    create:          string;
    user:          User;
    productsOrder: ProductsOrder[];
    orderDetail:   OrderDetail;
    receipt?:      Receipt;
    status:        string | boolean;
    invoiceType?:  string;
    bill?:         Bill;
    date?: number;
}

export interface IOrderCheckout {
    address?: OrderAddress;
    userId: string | undefined;
    account?: string;
    products: {
        productId: string;
        subproductId: string;
        quantity: number | undefined;
    }[];
    invoiceType?: string;
}

export interface Receipt {
    id: string | undefined;
    image: string;
    status: string;
  }
export interface OrderDetail {
    deliveryDate:    string;
    totalPrice:      string;
    transactions:    Transactions;
    deliveryAddress: OrderAddress;
}
export interface OrderAddress  {
    store?: string | boolean;
    address?: string;
    street?: string;
    number?: string;
    locality?: string;
    province?: string;
    country?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
}

export interface Transactions {
    status:    string;
    timestamp: string;
}

export interface ProductsOrder {
    id?: string;
    quantity: string;
    subproduct: SubproductOrder;
}

export interface SubproductOrder {
    amount: number;
    discount: number;
    id?: string;
    isAvailable?: boolean;
    price: number;
    product?: Product;
    stock: number;
    unit: string;
}

export interface Product {
    id:          string;
    description: string;
    imgUrl:      string;
}

export interface User {
    id:   string;
    name: string;
    email?: string;
}

export interface IAccountPayment {
    accountId: string;
    amount: number;
}

export interface Bill {
    id: string;  
    type: string;
    imgUrl: string | null;
    identification: string;
  }