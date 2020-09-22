import express from 'express';
import { decode, encode } from '../middlewares/jwt.js';
// controllers
import deleteController from '../controllers/delete.js';

const router = express.Router();

router
  .delete('/room/:roomId', decode, deleteController.deleteRoomById)
  .delete('/message/:messageId', decode, deleteController.deleteMessageById)

export default router;