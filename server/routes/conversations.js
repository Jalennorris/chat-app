import express from 'express';
const router = express.Router();
import conversationController from "../controllers/conversations.js";
import { verify, verifyRole } from '../middlewares/verify.js';

router
    .get('/', conversationController.getAllConversations)
    .get('/:id',  conversationController.getConversationById)
    .post('/',  conversationController.startConversation)
    .put('/:id',  conversationController.updateConversation)
    .delete('/:id',  conversationController.deleteConversation)
    .get('/:conversation_id/messages', conversationController.getConversationMessages)
    .get('/user/:user_id', conversationController.getUserConversations)
    


export default router;