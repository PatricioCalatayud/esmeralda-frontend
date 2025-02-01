export interface IAddress {
  id: string;
  address: string;
  locality: string;
  province: number;
  zipCode: string;
  street:string
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