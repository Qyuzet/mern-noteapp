import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 11V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5" />
                <path d="M5 15h14" />
                <path d="M5 11h14" />
                <path d="M4 7h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-800">NoteApp</span>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
      <footer className="py-4 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} NoteApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
