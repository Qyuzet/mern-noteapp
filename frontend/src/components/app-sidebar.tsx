import * as React from "react";
import { useState, useEffect } from "react";
import {
  CheckSquare,
  PlusCircle,
  ClipboardList,
  Home,
  Settings,
  User,
  Database,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

import { NavMain } from "@/components/nav-main";
import { SidebarOptInForm } from "@/components/sidebar-opt-in-form";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

// Updated navigation data with icons
const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      items: [],
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: ClipboardList,
      items: [
        {
          title: "View All Tasks",
          url: "/tasks",
          icon: CheckSquare,
        },
        {
          title: "Create New Task",
          url: "/product",
          icon: PlusCircle,
        },
      ],
    },
    {
      title: "Profile",
      url: "/user",
      icon: User,
      requiresAuth: true,
      items: [],
    },
    {
      title: "API Docs",
      url: "http://localhost:7777/api-docs/",
      icon: Database,
      external: true,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAuthenticated, user, logout } = useAuth();
  const [isSequelize, setIsSequelize] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current database type on component mount
  useEffect(() => {
    fetchDatabaseType();
  }, []);

  // Fetch the current database type from the backend
  const fetchDatabaseType = async () => {
    try {
      const response = await fetch("http://localhost:7777/api/system/db-type");
      const data = await response.json();

      if (data.success) {
        setIsSequelize(data.data.type === "sequelize");
      }
    } catch (error) {
      console.error("Error fetching database type:", error);
    }
  };

  // Toggle the database type
  const handleToggle = async () => {
    // Prevent multiple clicks
    if (isLoading) return;

    setIsLoading(true);

    // Show initial toast
    toast({
      title: "Changing Database",
      description: `Switching to ${
        !isSequelize ? "Sequelize" : "MongoDB"
      }. Please wait...`,
    });

    try {
      const response = await fetch(
        "http://localhost:7777/api/system/toggle-db",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          body: JSON.stringify({ useSequelize: !isSequelize }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update local state
        setIsSequelize(!isSequelize);

        // Show success message
        toast({
          title: "Database Changed",
          description: `Switched to ${
            !isSequelize ? "Sequelize" : "MongoDB"
          } successfully. The server is restarting.`,
        });

        // Show countdown toast
        let countdown = 10;
        const countdownInterval = setInterval(() => {
          countdown--;
          if (countdown <= 0) {
            clearInterval(countdownInterval);
            window.location.reload();
          } else {
            toast({
              title: "Reloading Soon",
              description: `Page will reload in ${countdown} seconds...`,
            });
          }
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to toggle database",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error toggling database:", error);

      // The server might be restarting, so we'll show a more helpful message
      toast({
        title: "Server Restarting",
        description: "The server is restarting. Please wait a moment...",
      });

      // Try to reconnect multiple times with increasing delays
      let attempts = 0;
      const maxAttempts = 5;
      const checkServer = () => {
        attempts++;
        setTimeout(() => {
          fetch("http://localhost:7777/api/system/db-type")
            .then((response) => {
              if (response.ok) {
                toast({
                  title: "Server Back Online",
                  description: "Reloading page...",
                });
                setTimeout(() => window.location.reload(), 1000);
              } else if (attempts < maxAttempts) {
                toast({
                  title: "Still Waiting",
                  description: `Attempt ${attempts}/${maxAttempts}: Server not ready yet...`,
                });
                checkServer();
              } else {
                toast({
                  title: "Reload Required",
                  description: "Please reload the page manually.",
                  variant: "destructive",
                });
                setIsLoading(false);
              }
            })
            .catch(() => {
              if (attempts < maxAttempts) {
                checkServer();
              } else {
                toast({
                  title: "Reload Required",
                  description: "Please reload the page manually.",
                  variant: "destructive",
                });
                setIsLoading(false);
              }
            });
        }, attempts * 2000); // Increasing delay: 2s, 4s, 6s, 8s, 10s
      };

      checkServer();
    }
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white" {...props}>
      <SidebarHeader className="border-b border-gray-100 pb-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a
                href="/"
                className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                  <CheckSquare className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-lg text-gray-800">
                    NoteApp
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Database className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-gray-500">
                      {isSequelize ? "Sequelize Powered" : "MongoDB Powered"}
                    </span>
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isAuthenticated && (
            <SidebarMenuItem className="mt-2">
              <div className="px-2 py-1 text-sm text-gray-600">
                Logged in as:{" "}
                <span className="font-semibold">{user?.name}</span>
              </div>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <div className="px-4 mb-4">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors px-2.5 py-1 font-medium">
            Task Management
          </Badge>
        </div>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 pt-4">
        <div className="px-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => logout()}
                className="w-full mb-4 flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </button>

              {/* Only show database toggle for admin users */}
              {/* Admin info - only visible to admins */}
              {user?.role === "admin" && (
                <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs font-medium text-blue-800">
                    Admin access enabled
                  </p>
                </div>
              )}

              {/* Database toggle - only visible to admins */}
              {user?.role === "admin" && (
                <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      Database Engine
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isSequelize
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {isSequelize ? "Sequelize (SQL)" : "MongoDB (NoSQL)"}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    <p>
                      Switching database engines will restart the server. This
                      may take a few moments.
                    </p>
                  </div>

                  <button
                    className={`w-full py-2 px-4 rounded-md transition-colors ${
                      isLoading
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : isSequelize
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    onClick={handleToggle}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Switching database...
                      </span>
                    ) : (
                      <>Switch to {isSequelize ? "MongoDB" : "Sequelize"}</>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <SidebarOptInForm />
          )}
          <div className="mt-4 px-2 py-3 bg-gray-50 rounded-lg text-xs text-gray-500 flex items-center gap-2">
            <Settings className="h-3.5 w-3.5 text-gray-400" />
            <span>v1.0.0 • MERN Stack</span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
