import express from 'express';
import { createUser, loginUser, getUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/", createUser)
userRouter.post("/view", getUser)
userRouter.post("/login", loginUser)

export default userRouter;