import React, { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, FileText, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaCode } from "react-icons/fa6";
import StackIcon from "tech-stack-icons";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen bg-gray-50">
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <SidebarTrigger className="bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200 rounded-md" />
        </div>

        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex h-14 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <SidebarTrigger className="hidden md:flex" />
            <div className="flex-1"></div>

            {/* API Docs button */}
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 mr-4"
              onClick={() =>
                window.open("http://localhost:7778/api-docs/", "_blank")
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">API Docs</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>

            {/* User info in header */}
            {user && (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>
                    Logged in as:{" "}
                    <span className="font-medium">{user.name}</span>
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </header>

        <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </div>

        {/* Footer with tech stack */}
        <footer className="border-t border-gray-200 bg-white py-8 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
                <FaCode className="text-blue-600" /> Built with modern
                technologies
              </h3>

              <div className="flex gap-4 justify-center flex-wrap mb-6">
                {[
                  "reactjs",
                  "js",
                  "typescript",
                  "mongoose",
                  "mongodb",
                  "nodejs",
                  "postman",
                ].map((tech) => (
                  <motion.div
                    key={tech}
                    whileHover={{ y: -5 }}
                    className="size-10 bg-white p-1.5 rounded-lg shadow-md"
                  >
                    <StackIcon name={tech} />
                  </motion.div>
                ))}
              </div>

              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} NoteApp. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </SidebarProvider>
  );
}
