import express from "express";
import { toggleFavorite } from "../controllers/favorite.controller.js";
import authMiddleware from "../middleware/auth.js";
import {getFavorite} from '../controllers/favorite.controller.js'

const router = express.Router();

router.post("/:itemId", authMiddleware, toggleFavorite);
router.get('/',authMiddleware,getFavorite);

export default router;
