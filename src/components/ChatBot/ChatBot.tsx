"use client";

import ChatBot from "react-chatbotify";

const ChatBotEsmeralda = () => {
  const settings = {
    general: {
      embedded: false,
      primaryColor: '#00796b'
    },
    header:{
      title: "EsmeraldaBot",
      avatar: "/Recurso1.png",
    },
    chatButton: {
      icon: "/Recurso1.png",
    },
    botBubble:{
      avatar: "/Recurso1.png",
    }
  }
  
  // styles here
  const styles = {
    headerStyle: {
      background: '#00796b',
      color: '#ffffff',
      padding: '10px',
    },
    chatWindowStyle: {
      backgroundColor: '#f2f2f2',
    },
    botAvatarStyle: {
      backgroundColor: '#00796b',
    },
    chatButtonStyle: {
      position: 'fixed' as const,
      bottom: '20px',
      right: '120px',
      zIndex: 50,
    },
    tooltipStyle: {
      position: 'fixed' as const,
      bottom: '20px',
      right: '210px',
      zIndex: 50,
    },

  };
  return (
    <ChatBot styles={styles} settings={settings} />

  );
};

export default ChatBotEsmeralda;