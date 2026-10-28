import { Express, Request } from "express";
import { Server } from "socket.io";
export {};

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      role?: string;
      contractorId?: string;
      io?: Server;
    }
    export interface Response {
      userId?: string;
      role?: string;
      contractorId?: string;
      io?: Server;
    }
  }
}
