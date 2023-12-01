import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import { Session, SessionData } from 'express-session';

interface AuthenticatedRequest extends Request {
    session: Session & Partial<SessionData> & { userId?: number };
  }
// Middleware to authenticate users
const authenticateUser = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    // Check if the user is authenticated by checking the session
    if (!req.session?.userId) {
      return res.render('Unauthorized');
    }
    next();
  };
  
  export { authenticateUser };