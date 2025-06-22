"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Heart, Sparkles, User, LogOut, LogIn, ChevronUp } from "lucide-react";
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
    url: "/",  // Points to homepage since that's where chat is
    icon: MessageCircle,
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  // Better Auth integration
  const { data: session, isPending } = useSession();
  const user = session?.user;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = () => {
    // Redirect to your login page
    window.location.href = "/login";
  };

  const handleLogout = async () => {
    try {
      // Use Better Auth's signOut function instead of direct fetch
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            // Redirect after successful logout
            window.location.href = "/login";
          },
          onError: (ctx) => {
            console.error("Logout failed:", ctx.error);
          }
        }
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // Force redirect even if logout fails
      window.location.href = "/login";
    }
  };
  
  // Determine current page from pathname
  const getCurrentPage = (): string => {
    if (pathname === "/") return "Chat";
    return "";
  };

  const currentPage = getCurrentPage();

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
        {/* Only render AnimatedBackground after client-side mount */}
        {isMounted && <AnimatedBackground />}
        
        <Sidebar className="border-r border-pink-100 bg-white/80 backdrop-blur-sm z-20">
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
                          currentPage === item.page ? 'bg-pink-50 text-pink-700 glow-effect' : ''
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

            <SidebarGroup className="mt-8">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100">
                <Heart className="w-8 h-8 text-pink-500 mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Safe Space</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  This is your private, judgment-free zone for all reproductive health questions.
                </p>
              </div>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-pink-100 p-6 bg-gradient-to-r from-pink-25 to-purple-25">
            {isPending ? (
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
                        {user ? (user.email || "Your health matters") : "Your health matters"}
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
  );
}