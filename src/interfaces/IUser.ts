export interface IUserProps {
  name: string;
  lastname: string;
  email: string;
  password: string;
  street: string;
  number: number | undefined;
  zipCode: string;
  locality: string;
  province: string;
  arca_identification: string;
  cuit: number | undefined;
  phone: string;
  account?: string;
}

export interface IAddressProps {
  street: string;
  number: string;
  zipcode?: string;
  locality: string;
  province: string;
}

export interface IUpdateProps {
  id: string;
  create?: string;
  update?: string;
  name?: string;
  email?: string;
  address?: IAddressProps;
  arca_identification?: string;
  cuit?: string;
  phone?: string;
  role?: string;
  isAvailable?: boolean;
  email_verified?: boolean;
  account?: any | null;
}

export interface IUserErrorProps {
  name: string;
  lastname: string;
  email: string;
  password: string;
  street: string;
  number: string;
  zipCode: string;
  locality: string;
  province: string;
  arca_identification: string;
  cuit: string;
  phone: string;
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


export interface IUserUpdateProps {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  accountLimit?: number;
  arca_identification?: string;
  cuit?: number;
  street?: string;
  number?: number;
  zipCode?: string;
  locality?: string;
  province?: string;
}
