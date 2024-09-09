"use client";
import ChatBot from "react-simple-chatbot";
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

const steps = [
    {
      id: '1',
      message: 'Hola guachin, ¿cómo te llamas?',
      trigger: '2', // Redirige al paso donde el usuario puede escribir
    },
    {
      id: '2',
      user: true, // El usuario puede escribir aquí
      trigger: '3', // Luego pasa al siguiente paso
    },
    {
      id: '3',
      message: '¡Hola {previousValue}, encantado de conocerte!',
      end: true,
    },
  ];
const ChatBotEsmeralda = () => {
    const [showChat, setShowChat] = useState(false);

    const chatRef = useRef<HTMLDivElement | null>(null);
    const toggleChat = () => {
      setShowChat((prev) => !prev); // Cambia el estado al hacer clic
    };
    useEffect(() => {
        const handleClickOutside = (event: any ) => {
          if (chatRef.current && !chatRef.current.contains(event.target)) {
            setShowChat(false);  // Cierra el chatbot si se hace clic fuera de él
          }
        };
    
        if (showChat) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [showChat]);
    
    return (
        <div className="fixed bottom-6 right-28 z-50">
        {/* Botón del ícono para abrir/cerrar el chatbot */}
        { !showChat && <button
          onClick={toggleChat}
          className="bg-primary hover:bg-teal-800 text-white rounded-full py-4 px-4 shadow-xl w-20 h-20"
        >
          <FontAwesomeIcon icon={faCommentDots} style={{ width: '26px', height: '26px' }} />
        </button>}
  
        {/* ChatBot se despliega o se oculta según el estado */}
        {showChat && (
          <div ref={chatRef} className="mt-4">
            <ChatBot steps={steps} />
          </div>
        )}
      </div>
    );
};

export default ChatBotEsmeralda