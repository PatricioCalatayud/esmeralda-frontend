export interface IOrders {
    id:            string;
    date:          string;
    user:          User;
    productsOrder: ProductsOrder[];
    orderDetail:   OrderDetail;
    receipt?:      Receipt;
    status:        string;
    invoiceType?:  string;
    bill?:         Bill; // Estructura del módulo Bill 
}

export interface IOrderCheckout {
    address?: string | undefined;
    userId: string | undefined;
    account?: string;
    products: {
        productId: string;
        subproductId: string;
        quantity: number | undefined;
    }[];
}

export interface Receipt {
    id: string | undefined; // Cambiado para permitir `undefined`
    image: string;
    status: string;
  }
export interface OrderDetail {
    deliveryDate:    string;
    totalPrice:      string;
    transactions:    Transactions;
    addressDelivery: string;
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

// Agregamos el módulo Bill
export interface Bill {
    id: string;  
    type: string;
    imgUrl: string | null;
    identification: string;
  }