import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import getAllUserMiddleware from "../controller/getAllUser";
import signupMiddleware from '../controller/signup';
import loginController from '../controller/login'

// implementation start here
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// GET all users route
router.get("/", getAllUserMiddleware);

// Creating new user
router.post("/signup", signupMiddleware);

// new user login
router.post("/login", loginController);

export default router;