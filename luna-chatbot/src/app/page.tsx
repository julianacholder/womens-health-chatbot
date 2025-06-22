"use client"

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import DashboardLayout from './dashboard/layout';

// Import your entities and integrations (you'll need to create these)
// import { ChatMessage as ChatMessageEntity } from "@/entities/ChatMessage";
// import { InvokeLLM } from "@/integrations/Core";

import WelcomeSection from "@/components/chat/WelcomeSection";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";

// Define types
interface Message {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: string;
}

const ChatPageContent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      // Call Luna API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({
          message: messageText
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from Luna');
      }

      // Create bot message
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        message: data.response,
        sender: "bot",
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);

    } catch (error) {
      console.error("Error generating response:", error);
      
      // Error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        message: "I'm so sorry, but I'm having trouble responding right now. Please try again in a moment. Your health questions are important to me! 💕",
        sender: "bot",
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...messages, errorMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    }

    setIsLoading(false);
  };

  const handleQuestionSelect = (question: string): void => {
    handleSendMessage(question);
  };

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