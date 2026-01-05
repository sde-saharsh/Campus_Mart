import express from 'express'
import {registerUser,loginUser,getUserDetails,toggleFavorite,updateUserProfile} from '../controllers/user.controller.js'
import authMiddleware from '../middleware/auth.js';


const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/me',authMiddleware,getUserDetails);
userRouter.post('/favorite/:id', authMiddleware, toggleFavorite);
userRouter.put('/update', authMiddleware, updateUserProfile);

export default userRouter;