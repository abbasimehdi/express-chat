// utils
import makeValidation from '@withvoid/make-validation';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// models
import UserModel, { USER_TYPES } from '../models/User.js';
export default {
  onGetAllUsers: async (req, res) => {
    try {
      const users = UserModel.find()
      .then(usr => {
        return res.status(200).json({ success: true, usr });
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
  onGetUserById: async (req, res) => {
      try {
        console.log(req.params.id);
        UserModel.findById(req.params.id)
        .then(user => {
            if(!user) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });            
            }
            res.send(user);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.userId
                });                
            }
            return res.status(500).send({
                message: "Error retrieving uaer with id " + req.params.user
            });
        });
      } catch (error) {
          console.log(error);
      }
   },
  onCreateUser: async (req, res) => { 
    const firstName = req.body.fileName;
    const lastName= req.bodylastName;
    const age = req.body.age; 
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type; 
    const created_at = req.body.created_at;
    const updated_at = req.body.updated_at;
    bcrypt.hash(password, 12)
    .then(hashedPw => {
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: hashedPw,
            type: type,
            created_at: created_at,
            updated_at: updated_at
        });
         return user.save();
    }).then(result => {
        res.status(201).json({ message : 'user created', userId : result.__id})
    })
    .catch(err => {
         res.status(500).send({
             message: err.message || "Some error occurred while creating the User."
         });
     });
  },
  onDeleteUserById: async (req, res) => {
      try {
        UserModel.findByIdAndRemove(req.params.id)
        .then(user => {
            if(!user) {

                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            
            res.status(200),send({message: "User deleted successfully!"});
        }).catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });                
            }
            return res.status(500).send({
                message: "Could not delete user with id " + req.params.id
            });
        });
      } catch (error) {
          console.log(error);
      }
   },
}