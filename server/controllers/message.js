import pool from '../config/dbConfig.js';
import { isValidMessage } from '../utils/validateMessage.js';

export default {
    getAllMessages: async (req, res) => {
        try {
            const messages = await pool.query('SELECT * FROM messages');
            res.json(messages.rows);
        } catch (error) {
            console.error('Error retrieving messages:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getMessageById: async (req, res) => {
        try {
            const { id } = req.params;
            const message = await pool.query('SELECT * FROM messages WHERE message_id = $1', [id]);
            if (message.rows.length === 0) {
                return res.status(404).json({ error: 'Message not found' });
            }
            res.status(201).json(message.rows[0]);
        } catch (error) {
            console.error('Error retrieving message by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    createMessage: async (req, res) => {
        try {
            const { conversation_id, sender_id, message_text } = req.body;
            if (!conversation_id || !sender_id || !message_text) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            // Validate the message text
            const maxLength = 1000; // Example maximum length
            if (!isValidMessage(message_text, maxLength)) {
                return res.status(400).json({ error: 'Invalid message text' });
            }
            const message = await pool.query('INSERT INTO messages(conversation_id, sender_id, message_text) VALUES($1, $2, $3) RETURNING *', [conversation_id, sender_id, message_text]);
            res.status(201).json(message.rows[0]);
        } catch (error) {
            console.error('Error creating message:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    updateMessage: async (req, res) => {
        try {
            const { id } = req.params;
            const { conversation_id, sender_id, message_text } = req.body;
            
            // Validate the message text
            const maxLength = 1000; // Example maximum length
            if (!isValidMessage(message_text, maxLength)) {
                return res.status(400).json({ error: 'Invalid message text' });
            }

            const updated = await pool.query('UPDATE messages SET conversation_id = $1, sender_id = $2, message_text = $3 WHERE message_id = $4', [conversation_id, sender_id, message_text, id]);
            res.json(updated, 'Message updated successfully');
        } catch (error) {
            console.error('Error updating message:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    deleteMessage: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Perform the deletion operation in the database
            const deleted = await pool.query('DELETE FROM messages WHERE message_id = $1', [id]);
            
            // Check if any rows were affected by the delete operation
            if (deleted.rowCount === 0) {
                return res.status(404).json({ error: 'Message not found' });
            }
            
            res.json('Message deleted successfully');
        } catch (error) {
            console.error('Error deleting message:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

};

