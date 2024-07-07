import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';
import './SendMessageForm.css';
import useAuthStore from '../../Store/authStore';
import useConversationStore from '../../Store/conversationStore';
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import  useThemeStore from '../../Store/themeStore'
function SendMessageForm() {
  const userId = useAuthStore((state) => state.userId);
  const conversationId = useConversationStore((state) => state.clickedConversationId);
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);
  const theme = useThemeStore()

  useEffect(() => {
    // Create a socket connection when component mounts if socket is not initialized
    if (!socket) {
      const newSocket = io('/');
      setSocket(newSocket);

      // Clean up function to close socket connection when component unmounts
      return () => {
        newSocket.close();
      };
    }
  }, [socket]); // Only re-run effect if socket changes

  const handleMessageChange = (event) => {
    setMessageText(event.target.value);
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post('/messages/send', {
        conversation_id: conversationId,
        sender_id: userId,
        message_text: messageText,
      });

      if (socket) {
        // Emit the new message to all connected clients via Socket.IO
        socket.emit('newMessage', response.data);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { mutate, isLoading, isError } = useMutation(sendMessage, {
    onSuccess: () => {
      console.log('Message sent successfully');
      setMessageText('');
    },
    onError: (error) => {
      console.error('Error sending message:', error.response.data.error);
      setError('Error sending message. Please try again later.');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className={`send-message-form ${theme} === dark ? "dark-theme" : "light-theme`}>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <textarea
            value={messageText}
            onChange={handleMessageChange}
            placeholder="Type your message here..."
            rows="4"
            className="message-textarea"
          ></textarea>
          <button type="submit" disabled={isLoading} className="send-button"
          style={{backgroundColor: 'blue'}}>
            <FontAwesomeIcon icon={faArrowRight} className="send-icon"/>
          </button>
        </div>
        {isError && <div className="error">{error}</div>}
      </form>
    </div>
  );
  
}

export default SendMessageForm;







