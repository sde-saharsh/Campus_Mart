import express from 'express'
import {createItem,getAllItems,getItemById,deleteItem,updateItem} from '../controllers/item.controller.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router();

router.post('/add',authMiddleware,createItem);
router.get('/all',getAllItems);
router.get('/:id',getItemById);
router.delete('/:id',authMiddleware,deleteItem)
router.put('/:id', authMiddleware, updateItem);

export default router;