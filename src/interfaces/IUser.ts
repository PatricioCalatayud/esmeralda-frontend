export interface IUserProps {
  name: string;
  email: string;
  password: string;
  phone: string;
}
export interface IUserUpdateProps {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  
}