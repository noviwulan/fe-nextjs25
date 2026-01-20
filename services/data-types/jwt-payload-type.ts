import { UserType } from './user-type';

export interface JWTPayloadTypes {
  iss: string;
  iat: number;
  exp: number;
  nbf: number;
  jti: string;
  sub: string;
  prv: string;
  user: UserType;
  roles?: string[];
  permissions?: string[];
}