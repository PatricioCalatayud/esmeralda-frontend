export interface IAddress {
  id: string;
  address: string;
  localidad: string;
  province: number;
  deliveryNumber?: number;
}

export interface ISession {
  id: string;
  name: string;
  email: string;
  image: string | undefined;
  role: string;
  phone?: string | undefined;
  address?: IAddress; // Nuevo campo para la dirección
}