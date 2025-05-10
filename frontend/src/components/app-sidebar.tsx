import * as React from "react";
import {
  CheckSquare,
  PlusCircle,
  ClipboardList,
  Settings,
  User,
  Database,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAuthenticated, user, logout } = useAuth();
  // No database toggle needed as we only use MongoDB

  return (
    <Sidebar className="border-r border-gray-200 bg-white" {...props}>
      <SidebarHeader className="border-b border-gray-100 pb-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a
                href="/tasks"
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
                      MongoDB Powered
                    </span>
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isAuthenticated && (
            <SidebarMenuItem className="mt-2">
              <div className="px-2 py-2 bg-blue-50 rounded-md border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-blue-800">
                      {user?.name}
                    </div>
                    <div className="text-xs text-blue-600">{user?.email}</div>
                  </div>
                </div>
                {user?.isVerified ? (
                  <div className="text-xs flex items-center gap-1 text-green-600 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Verified Account
                  </div>
                ) : (
                  <div className="text-xs flex items-center gap-1 text-amber-600 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    Verification Pending
                  </div>
                )}
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

              {/* MongoDB is the only database used in this application */}
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
