import express from 'express';
import { verify, verifyRole } from '../middlewares/verify.js';
import messageController from '../controllers/message.js';


const router = express.Router();

// Protected routes
router
  .get('/all', messageController.getAllMessages)
  .get('/:id',  messageController.getMessageById)
  .post('/send',messageController.createMessage)
  .put('/:id',  messageController.updateMessage)
  .delete('/:id',  messageController.deleteMessage);

export default router;

