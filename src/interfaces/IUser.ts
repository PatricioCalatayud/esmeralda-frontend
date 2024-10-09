export interface IUserProps {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: IAddressProps;
  account?: string;
}

export interface IAddressProps {
  province: number; // Mantiene el tipo number para las solicitudes POST
  localidad: string;
  deliveryNumber: number;
  address: string;
}

export interface IUserErrorProps {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: {
    province: string; // Los errores son strings
    localidad: string;
    deliveryNumber: string;
    address: string;
  };
}

export interface IAccountProps {
  balance: number;
creditLimit: number;
id: string;
}

export interface IUserUpdateProps {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  accountLimit?: number;
}