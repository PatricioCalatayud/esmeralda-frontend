export interface ISession {
  id: string;
  name: string;
  email: string;
  image: string | undefined;
  role: string;
  phone?: string | undefined;
}
