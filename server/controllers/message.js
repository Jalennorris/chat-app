import pool from "../config/dbConfig.js";
import { isValidMessage } from "../utils/validateMessage.js";

export default {
    getAllMessages: async (req, res) => {
        try {
            const client = await pool.connect();
            const query = 'SELECT * FROM messages';
            const { rows: messages } = await client.query(query);
            client.release();
            res.json(messages);
        } catch (error) {
            console.error('Error retrieving messages:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getMessageById: async (req, res) => {
        try {
            const { id } = req.params;
            const client = await pool.connect();
            const query = 'SELECT * FROM messages WHERE message_id = $1';
            const { rows: message } = await client.query(query, [id]);
            client.release();

            if (message.length === 0) {
                return res.status(404).json({ error: 'Message not found' });
            }

            res.json(message[0]);
        } catch (error) {
            console.error('Error retrieving message by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    createMessage: async (req, res) => {
        let client;
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
    
            client = await pool.connect();
            const insertQuery = 'INSERT INTO messages (conversation_id, sender_id, message_text) VALUES ($1, $2, $3) RETURNING *';
            const { rows: message } = await client.query(insertQuery, [conversation_id, sender_id, message_text]);
    
            res.status(201).json(message[0]);
        } catch (error) {
            console.error('Error creating message:', error);
            if (error.code === '23503') {
                // Foreign key violation
                res.status(400).json({ error: 'Invalid conversation_id or sender_id' });
            } else if (error.code === '23505') {
                // Unique constraint violation
                res.status(400).json({ error: 'Duplicate message' });
            } else {
                res.status(500).json({ error: 'Internal Server Error', details: error.message });
            }
        } finally {
            if (client) {
                client.release();
            }
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

            const client = await pool.connect();
            const updateQuery = 'UPDATE messages SET conversation_id = $1, sender_id = $2, message_text = $3 WHERE message_id = $4 RETURNING *';
            const { rows: updatedMessage } = await client.query(updateQuery, [conversation_id, sender_id, message_text, id]);
            client.release();

            if (updatedMessage.length === 0) {
                return res.status(404).json({ error: 'Message not found' });
            }

            res.json(updatedMessage[0]);
        } catch (error) {
            console.error('Error updating message:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteMessage: async (req, res) => {
        try {
            const { id } = req.params;
            const client = await pool.connect();

            const deleteQuery = 'DELETE FROM messages WHERE message_id = $1';
            await client.query(deleteQuery, [id]);
            client.release();

            res.json({ message: 'Message deleted successfully' });
        } catch (error) {
            console.error('Error deleting message:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
