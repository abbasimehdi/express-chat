import privateMessageModel from '../models/privateMessage.js';
import UserModel from '../models/User.js';
export default {
    postMessage: async (req, res) => { 
      try {
        const receiverId = req.body.userId;
        const messagePayload = {
          messageText: req.body.messageText,
        };
        
        const senderId = req.userId;
        const post = await privateMessageModel.createPostInChat(receiverId, messagePayload, senderId);
        global.io.sockets.in(senderId).emit('new message', { message: post });
        return res.status(200).json({ success: true, post });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
    },
    getConversationById: async (req, res) => { 
      try {

        const { userId }  = req.params;
        const user = await UserModel.getUserByIds(userId);
        const options = {
          page: parseInt(req.query.page) || 0,
          limit: parseInt(req.query.limit) || 10,
        };
        const conversation = await privateMessageModel.getConversationById(userId, options);
        return res.status(200).json({
          success: true,
          conversation,
          user,
        });
      } catch (error) {
        return res.status(500).json({ success: false, error });
      }
    },
  }

  
  