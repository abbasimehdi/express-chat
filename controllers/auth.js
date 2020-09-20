// models
import UserModel, { USER_TYPES } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default {
  login: async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    UserModel.findOne({email : email})
    .then(user => {
        if(!user){
            const error = new Error('A user with this email does not exist');
            error.statusCode = 422;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);

    }).then(isEqual => {
        if(!isEqual){
            const error = new Error('Wrong password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
              email: loadedUser.email,
              userId: loadedUser._id.toString()
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
          );
          res.status(200).json({ details: loadedUser, token: token, userId: loadedUser._id.toString });
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
        });
    });












    //   try {
    //     UserModel.findByIdAndRemove(req.params.id)
    //     .then(user => {
    //         if(!user) {

    //             return res.status(404).send({
    //                 message: "User not found with id " + req.params.id
    //             });
    //         }
            
    //         res.status(200),send({message: "User deleted successfully!"});
    //     }).catch(err => {
    //         if(err.kind === 'ObjectId' || err.name === 'NotFound') {
    //             return res.status(404).send({
    //                 message: "User not found with id " + req.params.id
    //             });                
    //         }
    //         return res.status(500).send({
    //             message: "Could not delete user with id " + req.params.id
    //         });
    //     });
    //   } catch (error) {
    //       console.log(error);
    //   }
   },
}