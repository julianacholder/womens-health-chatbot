"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Message {
  id: string;
  message: string;
  sender: "user" | "bot";
  timestamp: string;
  messageType?: "normal" | "emergency" | "out_of_domain" | "error";
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

interface ConversationContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  addMessage: (message: Message) => void;
  createNewConversation: () => Conversation;
  switchConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const useConversations = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationProvider');
  }
  return context;
};

interface ConversationProviderProps {
  children: ReactNode;
  userId?: string;
}

export const ConversationProvider: React.FC<ConversationProviderProps> = ({ children, userId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');

  // Get current conversation
  const currentConversation = conversations.find(conv => conv.id === currentConversationId) || null;

  // Initialize when user changes
  useEffect(() => {
    console.log('🔄 ConversationProvider: Initializing for user:', userId);
    
    if (userId) {
      loadUserConversations();
    } else {
      createGuestConversation();
    }
  }, [userId]);

  const loadUserConversations = () => {
    if (!userId) return;
    
    try {
      const saved = localStorage.getItem(`luna-conversations-${userId}`);
      const savedCurrentId = localStorage.getItem(`luna-current-conversation-${userId}`);
      
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('📚 ConversationProvider: Loaded conversations:', parsed);
        setConversations(parsed);
        
        if (savedCurrentId && parsed.find((c: Conversation) => c.id === savedCurrentId)) {
          setCurrentConversationId(savedCurrentId);
        } else if (parsed.length > 0) {
          setCurrentConversationId(parsed[0].id);
        } else {
          createFirstConversation();
        }
      } else {
        createFirstConversation();
      }
    } catch (error) {
      console.error('ConversationProvider: Error loading conversations:', error);
      createFirstConversation();
    }
  };

  const createGuestConversation = () => {
    const guestConv: Conversation = {
      id: 'guest-chat',
      title: 'Chat with Luna',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log('👤 ConversationProvider: Created guest conversation');
    setConversations([guestConv]);
    setCurrentConversationId(guestConv.id);
  };

  const createFirstConversation = () => {
    if (!userId) return;
    
    const newConv: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };
    
    console.log('✨ ConversationProvider: Created first conversation:', newConv);
    setConversations([newConv]);
    setCurrentConversationId(newConv.id);
    
    localStorage.setItem(`luna-conversations-${userId}`, JSON.stringify([newConv]));
    localStorage.setItem(`luna-current-conversation-${userId}`, newConv.id);
  };

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };
    
    console.log('🆕 ConversationProvider: Creating new conversation:', newConv);
    
    // Update conversations list
    const updated = [newConv, ...conversations];
    setConversations(updated);
    setCurrentConversationId(newConv.id);
    
    // Save to localStorage for logged-in users
    if (userId) {
      localStorage.setItem(`luna-conversations-${userId}`, JSON.stringify(updated));
      localStorage.setItem(`luna-current-conversation-${userId}`, newConv.id);
    }
    
    return newConv;
  };

  const addMessage = (message: Message) => {
    console.log('📝 ConversationProvider: Adding message:', message);
    console.log('📝 ConversationProvider: To conversation:', currentConversationId);
    
    if (!currentConversationId) {
      console.error('❌ ConversationProvider: No current conversation to add message to');
      return;
    }

    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === currentConversationId) {
          const newMessages = [...conv.messages, message];
          
          // Update title from first user message
          let newTitle = conv.title;
          if (conv.messages.length === 0 && message.sender === 'user') {
            newTitle = message.message.slice(0, 40) + (message.message.length > 40 ? '...' : '');
            console.log('📝 ConversationProvider: Updated title to:', newTitle);
          }
          
          const updatedConv = {
            ...conv,
            messages: newMessages,
            title: newTitle,
            updatedAt: new Date().toISOString(),
          };
          
          console.log('📝 ConversationProvider: Updated conversation:', updatedConv);
          return updatedConv;
        }
        return conv;
      });
      
      // Save for logged-in users
      if (userId) {
        localStorage.setItem(`luna-conversations-${userId}`, JSON.stringify(updated));
        console.log('💾 ConversationProvider: Saved to localStorage');
      }
      
      return updated;
    });
  };

  const switchConversation = (conversationId: string) => {
    console.log('🔄 ConversationProvider: Switching to conversation:', conversationId);
    setCurrentConversationId(conversationId);
    
    if (userId) {
      localStorage.setItem(`luna-current-conversation-${userId}`, conversationId);
    }
  };

  const deleteConversation = (conversationId: string) => {
    console.log('🗑️ ConversationProvider: Deleting conversation:', conversationId);
    
    if (!userId) return;

    const updated = conversations.filter(conv => conv.id !== conversationId);
    setConversations(updated);
    
    // Handle current conversation deletion
    if (currentConversationId === conversationId) {
      if (updated.length > 0) {
        setCurrentConversationId(updated[0].id);
        localStorage.setItem(`luna-current-conversation-${userId}`, updated[0].id);
      } else {
        createFirstConversation();
        return;
      }
    }
    
    localStorage.setItem(`luna-conversations-${userId}`, JSON.stringify(updated));
  };

  // Debug logging
  useEffect(() => {
    console.log('🔍 ConversationProvider: Current state:', {
      conversationsCount: conversations.length,
      currentConversationId,
      currentConversation: currentConversation ? {
        id: currentConversation.id,
        title: currentConversation.title,
        messageCount: currentConversation.messages.length
      } : null
    });
  }, [conversations, currentConversationId, currentConversation]);

  const value: ConversationContextType = {
    conversations,
    currentConversation,
    addMessage,
    createNewConversation,
    switchConversation,
    deleteConversation
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};