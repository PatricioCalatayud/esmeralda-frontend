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
    id: string;
    image: string;
    status: string;
}

export interface OrderDetail {
    deliveryDate:    string;
    totalPrice:      string;
    transactions:    Transaction;
    addressDelivery: string;
}

export interface Transaction {
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
}

export interface IAccountPayment {
    accountId: string;
    amount: number;
}

// Agregamos el módulo Bill
export interface Bill {
    id:     string;
    type:   string;  // Tipo de factura (A, B, etc.)
    imgUrl: string | null;  // Puede ser null si no hay imagen
}