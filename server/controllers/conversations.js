import pool from "../config/dbConfig.js";

export default {
    getAllConversations: async (req, res) => {
        try {
            const client = await pool.connect();
            const query = 'SELECT * FROM conversations';
            const { rows: allConversations } = await client.query(query);
            client.release();
            res.json(allConversations);
        } catch (error) {
            console.error('Error retrieving conversations:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getConversationById: async (req, res) => {
        try {
            const { id } = req.params;
            const client = await pool.connect();
            const query = 'SELECT * FROM conversations WHERE conversation_id = $1';
            const { rows: conversation } = await client.query(query, [id]);
            client.release();

            if (conversation.length === 0) {
                return res.status(404).json({ error: 'Conversation not found' });
            }

            res.json(conversation[0]);
        } catch (error) {
            console.error('Error retrieving conversation by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    startConversation:async (req, res) => {
        try {
            const { sender_user_name, receiver_user_name, title } = req.body;
    
            // Ensure receiver_user_name and title are provided
            if (!receiver_user_name || !title) {
                return res.status(400).json({ error: 'Invalid request body. Please provide receiver_user_name and title.' });
            }
    
            // Function to get or create user by user_name
            const getUser = async (user_name) => {
                const userQuery = 'SELECT user_id FROM "user" WHERE user_name = $1';
                const userResult = await pool.query(userQuery, [user_name]);
                if (userResult.rows.length > 0) {
                    return userResult.rows[0].user_id;
                } else {
                    const insertUserQuery = 'INSERT INTO "user" (user_name) VALUES ($1) RETURNING user_id';
                    const insertUserResult = await pool.query(insertUserQuery, [user_name]);
                    return insertUserResult.rows[0].user_id;
                }
            };
    
            let senderId;
            if (!isNaN(sender_user_name)) {
                // If sender_user_name is numeric, treat it as an ID
                senderId = parseInt(sender_user_name);
            } else {
                // If sender_user_name is not numeric, get or create sender by user_name
                senderId = await getUser(sender_user_name);
            }
    
            // Get or create receiver by user_name
            const receiverId = await getUser(receiver_user_name);
    
            // Start a transaction to ensure data consistency
            await pool.query('BEGIN');
    
            // Insert the conversation into the database
            const conversationQuery = 'INSERT INTO conversations (title, type) VALUES ($1, $2) RETURNING conversation_id';
            const type = 'one-to-one'; // Since it's a conversation with a single receiver
            const conversationValues = [title, type];
            const conversationResult = await pool.query(conversationQuery, conversationValues);
            const conversationId = conversationResult.rows[0].conversation_id;
    
            // Insert the participants into the database
            const participantQuery = 'INSERT INTO participants (user_id, conversation_id, receiver_id) VALUES ($1, $2, $3)';
            const participantValues = [senderId, conversationId, receiverId];
            await pool.query(participantQuery, participantValues);
    
            // Commit the transaction
            await pool.query('COMMIT');
    
            // Send the conversation ID in the response
            res.status(201).json({ conversationId });
    
            // Log the conversation ID and success message
            console.log('Conversation successfully started. Conversation ID:', conversationId);
        } catch (error) {
            console.error('Error starting conversation:', error);
    
            // Rollback the transaction in case of error
            try {
                await pool.query('ROLLBACK');
            } catch (rollbackError) {
                console.error('Error during rollback:', rollbackError);
            }
    
            // Log and return internal server error
            console.error('Conversation start failed. Internal Server Error.');
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    
    

    updateConversation: async (req, res) => {
        try {
            const { id } = req.params;
            const { type, title, participants } = req.body;

            // Validate input (example validation)
            if (!type || !title || !participants || !Array.isArray(participants)) {
                return res.status(400).json({ error: 'Invalid request body' });
            }

            // Perform database operation to update conversation (not implemented in this example)
            res.json({ message: 'Conversation updated successfully' });
        } catch (error) {
            console.error('Error updating conversation:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteConversation: async (req, res) => {
        try {
            const { id } = req.params;
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const deleteConversationQuery = 'DELETE FROM conversations WHERE conversation_id = $1';
                await client.query(deleteConversationQuery, [id]);

                await client.query('COMMIT');

                res.json({ message: 'Conversation deleted successfully' });
            } catch (error) {
                await client.query('ROLLBACK');
                console.error('Error deleting conversation:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            } finally {
                client.release();
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getConversationMessages: async (req, res) => {
        try {
            const { conversation_id } = req.params;
            console.log('Received conversation_id:', conversation_id); // Log the conversation_id
            
            // Perform database operation to retrieve messages for the conversation
            const messagesQuery = `
            SELECT m.message_text, u.user_name, m.sent_at, m.message_id
            FROM messages m
            JOIN "user" u ON m.sender_id = u.user_id
            WHERE m.conversation_id = $1
            ORDER BY m.sent_at ASC, m.message_id ASC`;
            
            const messagesValues = [conversation_id];
            console.log('Executing query:', messagesQuery, messagesValues); // Log the query and parameters
            
            const messagesResult = await pool.query(messagesQuery, messagesValues);
            const messages = messagesResult.rows
            
            if (messages.length === 0) {
                console.log('No messages found for conversation_id:', conversation_id);// Log if no messages are found
                return res.json();
            }
        
            
            res.json(messages);
        } catch (error) {
            console.error('Error retrieving conversation messages:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    
   

    getUserConversations: async (req, res) => {
        try {
            const { user_id } = req.params;
    
            // Query to retrieve conversations where the provided user_id is the sender
            const query = `
               SELECT 
    p.conversation_id AS "Conversation ID",
    p.user_id AS "Sender ID",
    p.receiver_id AS "Receiver ID",
    u_sender.user_name AS "Sender Username",
    u_receiver.user_name AS "Receiver Username",
    c.title AS "Title"
FROM 
    participants p
JOIN 
    conversations c ON p.conversation_id = c.conversation_id
JOIN 
    "user" u_sender ON p.user_id = u_sender.user_id
JOIN 
    "user" u_receiver ON p.receiver_id = u_receiver.user_id
WHERE 
    p.user_id = $1 OR p.receiver_id = $1;

`;
            const { rows: userConversations } = await pool.query(query, [user_id]);
    
            res.status(200).json(userConversations);
        } catch (error) {
            console.error('Error retrieving user conversations:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    
};