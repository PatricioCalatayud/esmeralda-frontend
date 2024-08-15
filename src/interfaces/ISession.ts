export interface ISession {
  name: string;
  email: string;
  image: string | undefined;
  role: string;
  phone?: string | undefined;
}
