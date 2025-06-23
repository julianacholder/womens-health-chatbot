"use client"

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import DashboardLayout from './dashboard/layout';

import WelcomeSection from "@/components/chat/WelcomeSection";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { useSession } from "@/lib/auth-client";
import { useConversations, Message } from "@/contexts/ConversationContext";

// FastAPI response interface
interface FastAPIResponse {
  success: boolean;
  response: string;
  message_type: "normal" | "emergency" | "out_of_domain" | "error";
}

const ChatPageContent: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user;
  
  const { 
    currentConversation, 
    addMessage 
  } = useConversations();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string>('');
  const [isClient, setIsClient] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // FastAPI backend URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://women-health-chatbot-backend-production.up.railway.app';

  // Update showWelcome state based on current conversation
  useEffect(() => {
    const shouldShowWelcome = !currentConversation || currentConversation.messages.length === 0;
    if (shouldShowWelcome !== showWelcome) {
      setShowWelcome(shouldShowWelcome);
    }
  }, [currentConversation, showWelcome]);

  const messages = currentConversation?.messages || [];

  // Debug logging
  useEffect(() => {
    console.log('🎯 Chat Page State:', {
      userId: user?.id,
      currentConversation: currentConversation ? {
        id: currentConversation.id,
        title: currentConversation.title,
        messageCount: currentConversation.messages.length
      } : null,
      showWelcome,
      messagesLength: messages.length
    });
  }, [currentConversation, user, showWelcome]);

  // Ensure component only runs on client
  useEffect(() => {
    setIsClient(true);
    // Generate session ID
    setSessionId(`session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  useEffect(() => {
    if (isClient) {
      scrollToBottom();
    }
  }, [messages, isClient]);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (messageText: string): Promise<void> => {
    console.log('📤 Sending message:', messageText);
    setIsLoading(true);

    try {
      // Create user message
      const userMessage: Message = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message: messageText,
        sender: "user",
        timestamp: new Date().toISOString()
      };

      console.log('👤 Created user message:', userMessage);
      
      // Add user message to conversation immediately
      addMessage(userMessage);

      // Call FastAPI backend
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({
          question: messageText
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: FastAPIResponse = await response.json();

      if (!data.success) {
        throw new Error(data.response || 'Failed to get response from Luna');
      }

      // Create bot message
      const botMessage: Message = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message: data.response,
        sender: "bot",
        timestamp: new Date().toISOString(),
        messageType: data.message_type
      };

      console.log('🤖 Created bot message:', botMessage);
      
      // Add bot message to conversation
      addMessage(botMessage);

    } catch (error) {
      console.error("Error generating response:", error);
      
      const isNetworkError = error instanceof TypeError || 
                           (error as Error).message.includes('fetch');
      
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message: isNetworkError 
          ? "I'm having trouble connecting to my servers right now. Please check that the Luna API is running and try again! 💕"
          : "I'm so sorry, but I'm having trouble responding right now. Please try again in a moment. Your health questions are important to me! 💕",
        sender: "bot",
        timestamp: new Date().toISOString(),
        messageType: "error"
      };

      addMessage(errorMessage);
    }

    setIsLoading(false);
  };

  const handleQuestionSelect = (question: string): void => {
    handleSendMessage(question);
  };

  // Optional: Test API connection on component mount
  useEffect(() => {
    if (!isClient) return;
    
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
  }, [API_BASE_URL, isClient]);

  // Don't render anything until client-side
  if (!isClient) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-pink-25 to-purple-25">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-pink-400">Loading Luna...</div>
        </div>
      </div>
    );
  }

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