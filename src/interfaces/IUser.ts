export interface IUserProps {
  name: string,
    email: string,
    password: string,
    street: string,
    number: number | undefined,
    zipCode: string,
    locality: string,
    province: string,
    arca_identification: string,
    cuit:  number | undefined,
    phone: string,
  account?: string;
}

export interface IAddressProps {
  province: number; // Mantiene el tipo number para las solicitudes POST
  localidad: string;
  deliveryNumber: number;
  address: string;
}

export interface IUserErrorProps {
  name: string,
    email: string,
    password: string,
    street: string,
    number: string,
    zipCode: string,
    locality: string,
    province: string,
    arca_identification: string,
    cuit: string,
    phone: string,
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