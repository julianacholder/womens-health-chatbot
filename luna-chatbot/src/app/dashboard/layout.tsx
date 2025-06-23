"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Heart, Sparkles, User, LogOut, LogIn, ChevronUp, Plus, Trash2, Clock } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "@/lib/auth-client";
import { ConversationProvider, useConversations } from "@/contexts/ConversationContext";
import { format } from "date-fns";
import dynamic from 'next/dynamic';

// Import AnimatedBackground as a dynamic component with no SSR
const AnimatedBackground = dynamic(() => import('@/components/ui/AnimatedBackground'), {
  ssr: false
});

interface NavigationItem {
  title: string;
  page: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  {
    title: "Chat with Luna",
    page: "Chat",
    url: "/",
    icon: MessageCircle,
  },
];

// Create a separate component for the sidebar content that uses conversations
const SidebarWithConversations: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user;
  
  const { 
    conversations, 
    currentConversation, 
    createNewConversation, 
    switchConversation, 
    deleteConversation 
  } = useConversations();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d');
    } catch {
      return 'Recent';
    }
  };

  const handleNewChat = () => {
    createNewConversation();
  };

  const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(conversationId);
    }
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/login";
          },
          onError: (ctx) => {
            console.error("Logout failed:", ctx.error);
          }
        }
      });
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/login";
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return "User";
  };

  return (
    <>
     <style jsx>{`
        :root {
          --primary-pink: #f8e8f5;
          --accent-pink: #e91e63;
          --soft-purple: #9c27b0;
          --warm-white: #fefefe;
          --gentle-gray: #f5f5f7;
          --text-soft: #6b7280;
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8f5e8 100%);
        }
        
        .chat-gradient {
          background: linear-gradient(145deg, #fce4ec 0%, #f8bbd9 100%);
        }
        
        .glow-effect {
          box-shadow: 0 8px 32px rgba(233, 30, 99, 0.1);
        }
      `}</style>
      
      <SidebarHeader className="border-b border-pink-100 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 chat-gradient rounded-full flex items-center justify-center glow-effect">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Luna Health</h2>
            <p className="text-xs text-pink-600 font-medium">Your wellness companion</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-pink-600 uppercase tracking-wider px-2 py-3">
            <Sparkles className="w-3 h-3 inline mr-2" />
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`hover:bg-pink-50 hover:text-pink-700 transition-all duration-300 rounded-xl mb-2 ${
                      "Chat" === item.page ? 'bg-pink-50 text-pink-700 glow-effect' : ''
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-4 py-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Conversation History - Only for logged in users */}
        {user && conversations.length > 0 && (
          <SidebarGroup className="mt-4">
            <div className="flex items-center justify-between px-2 py-3">
              <SidebarGroupLabel className="text-xs font-semibold text-pink-600 uppercase tracking-wider">
                <Clock className="w-3 h-3 inline mr-2" />
                Recent Chats
              </SidebarGroupLabel>
              <button
                onClick={handleNewChat}
                className="p-1 rounded-md hover:bg-pink-50 transition-colors"
                title="New Chat"
              >
                <Plus className="w-4 h-4 text-pink-600" />
              </button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {conversations.slice(0, 8).map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <div
                      className={`relative group rounded-xl mb-1 transition-all duration-300 ${
                        currentConversation?.id === conversation.id 
                          ? 'bg-pink-50 text-pink-700' 
                          : 'hover:bg-pink-50 hover:text-pink-700'
                      }`}
                    >
                      <div 
                        className="flex items-center gap-2 p-3 cursor-pointer"
                        onClick={() => switchConversation(conversation.id)}
                      >
                        <MessageCircle className="w-4 h-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {conversation.title === 'New Chat' && conversation.messages.length === 0
                              ? '✨ New Chat' 
                              : conversation.title
                            }
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(conversation.updatedAt)} • {conversation.messages.length} messages
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConversation(e, conversation.id)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition-all z-10"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* New Chat Button for logged in users without conversations */}
        {user && conversations.length === 0 && (
          <SidebarGroup className="mt-4">
            <SidebarGroupContent>
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-3 px-4 py-3 text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300 border-2 border-dashed border-pink-200 hover:border-pink-300"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Start New Chat</span>
              </button>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-8">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100">
            <Heart className="w-8 h-8 text-pink-500 mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Safe Space</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {user 
                ? "Your conversations are saved securely. Start a new chat anytime!"
                : "Login to save your conversations and access them anytime."
              }
            </p>
            {!user && (
              <button
                onClick={handleLogin}
                className="mt-3 text-xs text-pink-600 hover:text-pink-700 font-medium"
              >
                Login to save chats →
              </button>
            )}
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-pink-100 p-6 bg-gradient-to-r from-pink-25 to-purple-25">
        {!user ? (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 bg-pink-200 rounded-full"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-pink-200 rounded mb-1"></div>
              <div className="h-3 bg-pink-100 rounded w-2/3"></div>
            </div>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full hover:bg-pink-50 p-2 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300">
                {user ? (
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.image || undefined} alt={getUserDisplayName()} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-200 to-purple-200 text-pink-700 font-semibold">
                      {getUserInitials(getUserDisplayName())}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-pink-700" />
                  </div>
                )}
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {user ? getUserDisplayName() : "Welcome, Beautiful"}
                  </p>
                  <p className="text-xs text-pink-600">
                    {user ? (user.email || "Your health matters") : "Login to save chats"}
                  </p>
                </div>
                <ChevronUp className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              side="top"
              className="w-64 mb-2 bg-white/95 backdrop-blur-sm border-pink-100"
            >
              {user ? (
                <>
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-pink-100" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="hover:bg-pink-50 focus:bg-pink-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem 
                  onClick={handleLogin}
                  className="hover:bg-pink-50 focus:bg-pink-50 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login to your account
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </>
  );
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ConversationProvider userId={user?.id}>
      <SidebarProvider>
        <style jsx>{`
          :root {
            --primary-pink: #f8e8f5;
            --accent-pink: #e91e63;
            --soft-purple: #9c27b0;
            --warm-white: #fefefe;
            --gentle-gray: #f5f5f7;
            --text-soft: #6b7280;
          }
          
          .gradient-bg {
            background: linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8f5e8 100%);
          }
          
          .chat-gradient {
            background: linear-gradient(145deg, #fce4ec 0%, #f8bbd9 100%);
          }
          
          .glow-effect {
            box-shadow: 0 8px 32px rgba(233, 30, 99, 0.1);
          }
        `}</style>
        
        <div className="min-h-screen flex w-full gradient-bg relative isolate">
          {isMounted && <AnimatedBackground />}
          
          <Sidebar className="border-r border-pink-100 bg-white/80 backdrop-blur-sm z-20">
            <SidebarWithConversations />
          </Sidebar>

          <main className="flex-1 flex flex-col z-10">
            <header className="bg-white/90 backdrop-blur-sm border-b border-pink-100 px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-pink-50 p-2 rounded-xl transition-colors duration-200" />
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <h1 className="text-lg font-bold text-gray-800">Luna Health</h1>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ConversationProvider>
  );
}   