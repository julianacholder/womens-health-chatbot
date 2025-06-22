"use client"

import React from "react";
import { motion } from "framer-motion";
import { Heart, User } from "lucide-react";
import { format } from "date-fns";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-br from-purple-200 to-pink-200' 
            : 'bg-gradient-to-br from-pink-200 to-rose-200'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-purple-600" />
          ) : (
            <Heart className="w-5 h-5 text-pink-600" />
          )}
        </div>
        
        <div className={`rounded-3xl px-6 py-4 shadow-sm ${
          isUser 
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
            : 'bg-white border border-pink-100'
        }`}>
          <p className={`leading-relaxed ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {message}
          </p>
          {timestamp && (
            <p className={`text-xs mt-2 ${
              isUser ? 'text-pink-100' : 'text-gray-400'
            }`}>
              {format(new Date(timestamp), 'h:mm a')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;