import express from 'express';
// middlewares
import AuthController from "../controllers/auth.js";
const router = express.Router();

router
  .post('/login', AuthController.login);

export default router;
AuthController.login


// import express from 'express';
// // middlewares
// import { encode } from '../middlewares/jwt.js';

// const router = express.Router();

// router
//   .post('/login/:userId', encode, (req, res, next) => {
//     return res
//       .status(200)
//       .json({
//         success: true,
//         authorization: req.authToken,
//       });
//   });

// export default router;
