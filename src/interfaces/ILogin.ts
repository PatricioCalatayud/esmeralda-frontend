export interface ILoginProps {
  email: string;
  password?: string | undefined;
  accessToken?: string;

}
export interface ILogin {
  email: string;
  password: string;
  accessToken?: string;

}
export interface ILoginErrorProps {
  email: string;
  password: string;
}
