import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const MESSAGE_TYPES = {
  TYPE_TEXT: "text",
};

const readByRecipientSchema = new mongoose.Schema(
  {
    _id: false,
    readByUserId: String,
    readAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: false,
  }
);

const privateMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    senderId: String,
    receiverId: String,
    message: mongoose.Schema.Types.Mixed,
    type: {
      type: String,
      default: () => MESSAGE_TYPES.TYPE_TEXT,
    },
    postedByUser: String,
    readByRecipients: [readByRecipientSchema],
  },
  {
    timestamps: true,
    collection: "privateMessages",
  }
);

privateMessageSchema.statics.createPostInChat = async function (receiverId, message, postedByUser) {
  try {
    const post = await this.create({
      message,
      postedByUser,
      receiverId,
      readByRecipients: { readByUserId: postedByUser }
    });
    const aggregate = await this.aggregate([
      // get post where _id = post._id
      { $match: { _id: post._id } },
      // do a join on another table called users, and 
      // get me a user whose _id = postedByUser
      {
        $lookup: {
          from: postedByUser,
          localField: 'postedByUser',
          foreignField: '_id',
          as: 'postedByUser',
        }
      },
      { $unwind: '$postedByUser' },
      // do a join on another table called chatrooms, and 
      // get me a chatroom whose _id = chatRoomId
      {
        $lookup: {
          from: 'privatechat',
          localField: 'privatechat',
          foreignField: '_id',
          as: 'privatechatInfo',
        }
      },
      { $unwind: '$privatechatInfo' },
      { $unwind: '$privatechatInfo.userId' },
      // do a join on another table called users, and 
      // get me a user whose _id = userIds
      {
        $lookup: {
          from: 'user',
          localField: 'privatechatInfo.userId',
          foreignField: '_id',
          as: 'privatechatInfo.userProfile',
        }
      },
      { $unwind: '$privatechatInfo.userProfile' },
      // group data
      {
        $group: {
          _id: '$privatechatInfo._id',
          postId: { $last: '$_id' },
          chatRoomId: { $last: '$privatechatInfo._id' },
          message: { $last: '$message' },
          type: { $last: '$type' },
          postedByUser: { $last: '$postedByUser' },
          readByRecipients: { $last: '$readByRecipients' },
          chatRoomInfo: { $addToSet: '$privatechatInfo.userProfile' },
          createdAt: { $last: '$createdAt' },
          updatedAt: { $last: '$updatedAt' },
        }
      }
    ]);
    return aggregate[0];
  } catch (error) {
    throw error;
  }
}

// privateMessageSchema.statics.getConversationByRoomId = async function (chatRoomId, options = {}) {
//   try {
//     return this.aggregate([
//       { $match: { chatRoomId } },
//       { $sort: { createdAt: -1 } },
//       // do a join on another table called users, and 
//       // get me a user whose _id = postedByUser
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'postedByUser',
//           foreignField: '_id',
//           as: 'postedByUser',
//         }
//       },
//       { $unwind: "$postedByUser" },
//       // apply pagination
//       { $skip: options.page * options.limit },
//       { $limit: options.limit },
//       { $sort: { createdAt: 1 } },
//     ]);
//   } catch (error) {
//     throw error;
//   }
// }

// privateMessageSchema.statics.markMessageRead = async function (chatRoomId, currentUserOnlineId) {
//   try {
//     return this.updateMany(
//       {
//         chatRoomId,
//         'readByRecipients.readByUserId': { $ne: currentUserOnlineId }
//       },
//       {
//         $addToSet: {
//           readByRecipients: { readByUserId: currentUserOnlineId }
//         }
//       },
//       {
//         multi: true
//       }
//     );
//   } catch (error) {
//     throw error;
//   }
// }
export default mongoose.model("privateMessage", privateMessageSchema);













// privateMessageSchema.statics.getConversationById = async function (userId, options = {}) {
//   try {
//     return this.aggregate([
//       { $match: { userId } },
//       { $sort: { createdAt: -1 } },
//       // do a join on another table called users, and 
//       // get me a user whose _id = postedByUser
//       {
//         $lookup: {
//           from: 'user',
//           localField: 'postedByUser',
//           foreignField: '_id',
//           as: 'postedByUser',
//         }
//       },
//       { $unwind: "$postedByUser" },
//       // apply pagination
//       { $skip: options.page * options.limit },
//       { $limit: options.limit },
//       { $sort: { createdAt: 1 } },
//     ]);
//   } catch (error) {
//     throw error;
//   }
// }

// export default mongoose.model("privateMessage", privateMessageSchema);