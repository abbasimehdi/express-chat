import ChatRoomModel from '../models/chatRoom.js';
import ChatMessageModel from '../models/ChatMessage.js';
export default {
  initiate: async (req, res) => {
    try {
      
      // const validation = makeValidation(types => ({
        
      //   payload: req.body,
      //   checks: {
      //     userIds: { 
      //       type: types.array, 
      //       options: { unique: true, empty: false, stringOnly: true } 
      //     },
      //     type: { type: types.enum, options: { enum: CHAT_ROOM_TYPES } },
      //   }
      // }));
      // if (!validation.success) return res.status(400).json({ ...validation });
  
      const { userIds, type } = req.body;


      const { userId: chatInitiator } = req;
      const allUserIds = [...userIds, chatInitiator];
      const chatRoom = await ChatRoomModel.initiateChat(allUserIds, type, chatInitiator);
      return res.status(200).json({ success: true, chatRoom });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  }, 
  
    postMessage: async (req, res) => { 
      try {
        const { roomId } = req.params;
        // const validation = makeValidation(types => ({
        //   payload: req.body,
        //   checks: {
        //     messageText: { type: types.string },
        //   }
        // }));
        // if (!validation.success) return res.status(400).json({ ...validation });
  
        const messagePayload = {
          messageText: req.body.messageText,
        };
        
        const currentLoggedUser = '6d92c06f9bcb466880ae59efa71a15b1';
        // const currentLoggedUser = req.userId;
        const post = await ChatMessageModel.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);

        global.io.sockets.in(roomId).emit('new message', { message: post });
        return res.status(200).json({ success: true, post });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
    },
    getRecentConversation: async (req, res) => { },
    getConversationByRoomId: async (req, res) => { },
    markConversationReadByRoomId: async (req, res) => { },
  }