export interface IUserProps {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: IAddressProps;
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