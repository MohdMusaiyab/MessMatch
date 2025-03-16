import { Express, Request } from "express";
import { Server } from "socket.io";
export {};

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      role?: string;
      io?: Server; // Add the io property to the Request interface
    }
    export interface Response {
      userId?: string;
      role?: string;
      io?: Server; // Add the io property to the Request interface
    }
  }
}
