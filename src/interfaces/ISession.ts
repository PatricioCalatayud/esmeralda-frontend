export interface IAddress {
  street: string;
  locality: string;
  province: string;
  zipcode: string;
  number: number
}

export interface ISession {
  id: string;
  name: string;
  email: string;
  image: string | undefined;
  role: string;
  phone?: string | undefined;
  address?: IAddress; // Nuevo campo para la dirección
  email_verified?: boolean;
  cuit?: number;
}