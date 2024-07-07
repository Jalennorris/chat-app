import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import SendMessageForm from './SendMessageForm';
import './ConversationMessages.css';
import useConversationStore from '../../Store/conversationStore';
import io from 'socket.io-client';
import useAuthStore from '../../Store/authStore';
import useThemeStore from '../../Store/themeStore';
import {format} from 'date-fns'


const ConversationMessages = ({ receiverUserName }) => {
  const username = useAuthStore(state => state.username);
  const conversationId = useConversationStore(state => state.clickedConversationId);
  const setUsername = useAuthStore(state => state.setUsername);
  const { theme } = useThemeStore((state) => state);
  const [messages, setMessages] = useState([]);
  const messageListRef = useRef(null);

  const { isLoading, isError, error, refetch } = useQuery(
    ['conversationMessages', conversationId],
    () => axios.get(`/conversations/${conversationId}/messages`).then(res => res.data),
    {
      enabled: !!conversationId,
      refetchInterval: 1000,
      onSuccess: data => {
        setMessages(data);
        if (data.length > 0 && !username) {
          setUsername(data[0].user_name);
        }
      },
      onError: error => console.error('Error fetching conversation messages:', error),
    }
  );

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL || '/');
    socket.on('connect_error', error => {
      console.error('Socket connection error:', error);
    });
    socket.on('newMessage', message => {
      if (message) {
        setMessages(prevMessages => [...prevMessages, message]);
        if (!username) {
          setUsername(message.user_name);
        }
        scrollToBottom();
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [setUsername, username]);

  useEffect(() => {
    if (conversationId) {
      refetch();
    }
  }, [conversationId, refetch]);

  useEffect(() => {
    if (messageListRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  if (isError) return <div>Error: {error ? error.message : 'Unknown error'}</div>;

  return (
    <div className={`chat-area ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <h2 className="chat-area__header">{receiverUserName}</h2>
      <div className="chat-area__message-container" ref={messageListRef}>
        <ul className="chat-area__message-list">
          {messages && messages.map(message => {
            if (message) {
              const isSenderCurrentUser = message.user_name === username;
              return (
                <li
                  key={message.message_id}
                  className={`chat-area__message ${isSenderCurrentUser ? 'chat-area__message--sent' : 'chat-area__message--received'}`}
                >
                  <p className="chat-area__message-text">{message.message_text}</p>
    
                  <p className="chat-area__message-timestamp">
                  {format(new Date(message.sent_at), 'hh:mm aa, MMM dd, yyyy')}
                  </p>
                
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
      <SendMessageForm />
    </div>
  );
};

export default ConversationMessages;