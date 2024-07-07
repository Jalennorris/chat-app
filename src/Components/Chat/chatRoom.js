import React, { useState } from 'react';
import ConversationMessages from './ConversationMessages ';
import Sidebar from './Sidebar'; // Assuming Sidebar component is in a separate file
import { Header } from '../Naviagtion/Header/header'; // Assuming Header from '../Naviagtion/Header/header';
import './chatRoom.css';
import useThemeStore from '../../Store/themeStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';


function Chatroom() {
  const { theme } = useThemeStore((state) => state);
  const [showChatArea, setShowChatArea] = useState(false);
  const [receiverUserName, setReceiverUserName] = useState("")

  const handleSidebarClick = (userName) => {
    setShowChatArea(true)
    setReceiverUserName(userName)
  };

  const handleBackClick = () => {
    setShowChatArea(false);
  };



  return (
    <div className={`chatroom ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <Header />
      <div className={`chatroom-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
        <div className={`chatroom-sidebar ${showChatArea ? 'hide-sidebar' : ''} ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
          <Sidebar onSidebarClick={handleSidebarClick} />
        </div>
        <div className={`chat-area ${showChatArea ? 'show-chat-area' : 'hide-chat-area'}`}>
          <button className={`back-button ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`} onClick={handleBackClick}> <FontAwesomeIcon icon={faArrowLeftLong} /></button>
          <ConversationMessages receiverUserName={receiverUserName}/>
        </div>
      </div>
    </div>
  );
}

export default Chatroom;