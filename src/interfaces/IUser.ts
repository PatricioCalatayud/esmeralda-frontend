export interface IUserProps {
  name: string;
  email: string;
  password: string;
  phone: string;
  account?: IAccountProps;
}
export interface IUserUpdateProps {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  accountLimit?: number;
}
export interface IAccountProps {
  balance: number;
creditLimit: number;
id: string;
}
