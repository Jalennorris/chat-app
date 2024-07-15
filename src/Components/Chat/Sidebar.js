import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import useAuthStore from '../../Store/authStore';
import useConversationStore from '../../Store/conversationStore';

import './StartConversationForm.css';
import './Sidebar.css'
import useThemeStore from '../../Store/themeStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import defaultProfilePic  from '../../Images/defaultProfilePic.png'
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';



const Sidebar = ({ onSidebarClick }) => {
  const userId = useAuthStore((state) => state.userId);
  const userName = useAuthStore((state) => state.username);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const queryClient = useQueryClient();
  const { theme } = useThemeStore((state) => state);

  useEffect(() => {
    const fetchUserConversations = async () => {
      try {
        const response = await axios.get(`/conversations/user/${userId}`);
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching user conversations:', error);
      }
    };

    fetchUserConversations();
  }, [userId]);

  const setClickedConversationId = useConversationStore((state) => state.setClickedConversationId);

  const handleConversationClick = (conversationId) => {
    // Corrected the typo in the if condition
    if (conversationId) {
      setClickedConversationId(conversationId);
  
      // Find the conversation object from the conversations array using the conversationId
      const conversation = conversations.find(conv => conv["Conversation ID"] === conversationId);
  
      if (conversation) {
        // Determine the other user's name based on the conversation object
        const otherUserName = conversation["Sender ID"] === userId 
          ? conversation["Receiver Username"] 
          : conversation["Sender Username"];
  
        onSidebarClick(otherUserName);
        console.log(`clicked userName: ${otherUserName}`);
      } else {
        console.error('Conversation not found:', conversationId);
      }
    } else {
      console.error('Invalid conversation ID:', conversationId);
    }
  };
  

  const deleteConversation = async (conversationId) => {
    try {
      await axios.delete(`/conversations/${conversationId}`);
      // Set a timeout to simulate a delay for the animation
      setTimeout(() => {
        setConversations(prevConversations => prevConversations.filter(conversation => conversation["Conversation ID"] !== conversationId));
      }, 300); // Adjust the delay as needed
      queryClient.invalidateQueries('users');
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleDeleteConversation = (conversationId) => {
    deleteConversation(conversationId);
  };

  const { data: allUsers = [], isLoading, isError } = useQuery(
    "users",
    async () => {
      const response = await axios.get("/users");
      return response.data;
    }
  );

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearchQuery = () => {
    setSearchQuery("");
  };

  const filterUsers = (users, query) => {
    return users.filter(
      (user) =>
        user.user_id.toString().includes(query) ||
        (user.user_name && user.user_name.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const filteredUsers = filterUsers(allUsers, searchQuery);

  const startConversation = async (receiverUserName) => {
    const title = "New Conversation";

    try {
      const response = await axios.post('/conversations', {
        sender_user_name: userName,
        receiver_user_name: receiverUserName,
        title
      });

      const newConversation = {
        "Conversation ID": response.data.conversationId,
        "Sender ID": userId,
        "Receiver ID": receiverUserName,
        "Sender Username": userName,
        "Receiver Username": receiverUserName,
        "Title": title
      };

      setConversations(prevConversations => [...prevConversations, newConversation]);
      queryClient.invalidateQueries('users');
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleUserNameClick = (userName) => {
    startConversation(userName);
  };


  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">Error fetching data</div>;

  return (
    <div className={`sidebar ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className={`search-column ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder='Search'
            value={searchQuery}
            onChange={handleSearchInputChange}
            className={`search-input ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}
          />
          {searchQuery && (
            <button onClick={clearSearchQuery} className={`clear-search-button ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>×</button>
          )}
        </div>
        {searchQuery && (
          <div className={`search-results ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
            {filteredUsers.map((user) => (
              <div key={user.user_id} onClick={() => handleUserNameClick(user.user_name)} className="user-details">
                <p>{user.user_name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={`conversation-list-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <ul className={`conversation-list ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
          {conversations.map((conversation) => (
            <li key={conversation["Conversation ID"]} className="conversation-item">
                <img src={defaultProfilePic} alt="profile" loading='lazy' className="profile-pic" />
              <div
                onClick={() => handleConversationClick(conversation["Conversation ID"], conversation["Receiver Username"])}
                className="conversation-item-title"
              >
                {conversation["Sender ID"] === userId ? conversation["Receiver Username"] : conversation["Sender Username"]}
              </div>
              <IconButton onClick={() => handleDeleteConversation(conversation["Conversation ID"])} aria-label="delete" color="error">
                <DeleteIcon className="delete-button" />
              </IconButton>
            </li>
          ))}
        </ul>
      </div>
      <Link to="/settings" className="settings-button">
        <FontAwesomeIcon className="settings-icon" icon={faCog} />
      </Link>
    </div>
  );
};

export default Sidebar;