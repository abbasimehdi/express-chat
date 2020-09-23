import express from 'express';
import { decode } from '../middlewares/jwt.js';
// controllers
import privateMessage from '../controllers/private.js';

const router = express.Router();

router
  // .get('/', Z.getRecentConversation)
  .get('/message/:userId', privateMessage.getConversationById)
  // .post('/initiate', privateMessage.initiate)
  // .post('/initiate', decode, privateMessage.initiate)
  .post('/message', privateMessage.postMessage)
  // .put('/:roomId/mark-read', private.markConversationReadByRoomId)

export default router;