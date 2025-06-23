"use client"

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import DashboardLayout from './dashboard/layout';

import WelcomeSection from "@/components/chat/WelcomeSection";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";

// Define types
interface Message {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: string;
  messageType?: "normal" | "emergency" | "out_of_domain" | "error";
}

// FastAPI response interface
interface FastAPIResponse {
  success: boolean;
  response: string;
  message_type: "normal" | "emergency" | "out_of_domain" | "error";
}

const ChatPageContent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // FastAPI backend URL - update this to match your deployment
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    loadMessages();
    // Generate session ID
    setSessionId(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (): Promise<void> => {
    try {
      // Check if we have any messages in localStorage
      const savedMessages = localStorage.getItem('luna-chat-messages');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        const userMessages = parsedMessages.filter((msg: Message) => msg.sender === "user");
        
        if (userMessages.length > 0) {
          setShowWelcome(false);
          setMessages(parsedMessages);
        } else {
          setShowWelcome(true);
          setMessages([]);
        }
      } else {
        setShowWelcome(true);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setShowWelcome(true);
      setMessages([]);
    }
  };

  const saveMessages = (newMessages: Message[]) => {
    try {
      localStorage.setItem('luna-chat-messages', JSON.stringify(newMessages));
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  };

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (messageText: string): Promise<void> => {
    setIsLoading(true);
    setShowWelcome(false); // Hide welcome when user sends first message

    try {
      // Create user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        message: messageText,
        sender: "user",
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);

      // Call FastAPI backend
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({
          question: messageText  // FastAPI expects 'question' not 'message'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FastAPIResponse = await response.json();

      if (!data.success) {
        throw new Error(data.response || 'Failed to get response from Luna');
      }

      // Create bot message with message type
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        message: data.response,
        sender: "bot",
        timestamp: new Date().toISOString(),
        messageType: data.message_type
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);

    } catch (error) {
      console.error("Error generating response:", error);
      
      // Check if it's a network error
      const isNetworkError = error instanceof TypeError || 
                           (error as Error).message.includes('fetch');
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        message: isNetworkError 
          ? "I'm having trouble connecting to my servers right now. Please check that the Luna API is running and try again! 💕"
          : "I'm so sorry, but I'm having trouble responding right now. Please try again in a moment. Your health questions are important to me! 💕",
        sender: "bot",
        timestamp: new Date().toISOString(),
        messageType: "error"
      };

      const updatedMessagesWithUser = [...messages, {
        id: `user-${Date.now()}`,
        message: messageText,
        sender: "user" as const,
        timestamp: new Date().toISOString()
      }];

      const finalMessages = [...updatedMessagesWithUser, errorMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    }

    setIsLoading(false);
  };

  const handleQuestionSelect = (question: string): void => {
    handleSendMessage(question);
  };

  // Optional: Test API connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
          console.log('✅ Connected to Luna API');
        } else {
          console.warn('⚠️ Luna API health check failed');
        }
      } catch (error) {
        console.warn('⚠️ Cannot connect to Luna API:', error);
      }
    };

    testConnection();
  }, [API_BASE_URL]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-pink-25 to-purple-25">
      <div className="flex-1 overflow-y-auto">
        {showWelcome ? (
          <WelcomeSection onQuestionSelect={handleQuestionSelect} />
        ) : (
          <div className="max-w-4xl mx-auto py-8 px-4">
            <AnimatePresence>
              {messages.map((message: Message) => (
                <ChatMessage
                  key={message.id}
                  message={message.message}
                  isUser={message.sender === "user"}
                  timestamp={message.timestamp}
                  messageType={message.messageType}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default function HomePage() {
  return (
    <DashboardLayout>
      <ChatPageContent />
    </DashboardLayout>
  );
}