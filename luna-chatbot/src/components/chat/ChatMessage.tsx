"use client"

import React from "react";
import { motion } from "framer-motion";
import { Heart, User, AlertTriangle, Info } from "lucide-react";
import { format } from "date-fns";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  messageType?: "normal" | "emergency" | "out_of_domain" | "error";
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isUser, 
  timestamp, 
  messageType = "normal" 
}) => {
  // Get styling based on message type for bot messages
  const getBotStyling = () => {
    if (isUser) {
      return {
        container: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
        text: 'text-white',
        timestamp: 'text-pink-100',
        avatar: 'bg-gradient-to-br from-purple-200 to-pink-200',
        icon: <User className="w-5 h-5 text-purple-600" />
      };
    }

    switch (messageType) {
      case "emergency":
        return {
          container: 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200',
          text: 'text-red-800',
          timestamp: 'text-red-500',
          avatar: 'bg-gradient-to-br from-red-200 to-red-300',
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />
        };
      case "out_of_domain":
        return {
          container: 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200',
          text: 'text-amber-800',
          timestamp: 'text-amber-600',
          avatar: 'bg-gradient-to-br from-yellow-200 to-amber-200',
          icon: <Info className="w-5 h-5 text-amber-600" />
        };
      case "error":
        return {
          container: 'bg-gradient-to-br from-red-25 to-red-50 border-2 border-red-100',
          text: 'text-red-700',
          timestamp: 'text-red-400',
          avatar: 'bg-gradient-to-br from-red-100 to-red-200',
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />
        };
      default: // normal
        return {
          container: 'bg-white border border-pink-100',
          text: 'text-gray-800',
          timestamp: 'text-gray-400',
          avatar: 'bg-gradient-to-br from-pink-200 to-rose-200',
          icon: <Heart className="w-5 h-5 text-pink-600" />
        };
    }
  };

  const styling = getBotStyling();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${styling.avatar}`}>
          {styling.icon}
        </div>
        
        <div className={`rounded-3xl px-6 py-4 shadow-sm ${styling.container}`}>
          <p className={`leading-relaxed ${styling.text}`}>
            {message}
          </p>
          {timestamp && (
            <p className={`text-xs mt-2 ${styling.timestamp}`}>
              {format(new Date(timestamp), 'h:mm a')}
            </p>
          )}
          
          {/* Optional: Add message type indicator for non-normal messages */}
          {!isUser && messageType !== "normal" && (
            <div className={`text-xs mt-1 opacity-75 ${styling.text}`}>
              {messageType === "emergency" && "🆘 Emergency"}
              {messageType === "out_of_domain" && "💡 General Info"}
              {messageType === "error" && "⚠️ Error"}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;