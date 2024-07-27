interface DecodedToken {
  userId: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  sub: string;
  roles: string[];
  isAvailable: boolean;
  isDeleted: boolean;
  iat: number;
  exp: number;
}
