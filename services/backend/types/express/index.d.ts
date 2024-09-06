import { Request } from 'express';
import { SessionToken } from '@libs/interfaces';

declare module 'express' {
  export interface Request {
    user?: SessionToken; // Adjust the type according to your payload
  }
}
