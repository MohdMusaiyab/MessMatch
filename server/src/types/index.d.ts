import { Express,Request } from "express";
export {};

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      role?: string;
    }
    export interface Response{
      userId?:string;
      role?:string;
    }
  }
}
