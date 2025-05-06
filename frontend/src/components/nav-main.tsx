import { MoreHorizontal, ChevronRight, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    external?: boolean;
    requiresAuth?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
      external?: boolean;
      requiresAuth?: boolean;
    }[];
  }[];
}) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <DropdownMenu key={item.title}>
              <SidebarMenuItem>
                {item.items?.length ? (
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="data-[state=open]:bg-blue-50 data-[state=open]:text-blue-700 hover:bg-gray-50 transition-colors duration-200 rounded-md px-3">
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="h-4 w-4 text-blue-600" />}
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                ) : (
                  <SidebarMenuButton
                    asChild
                    className={`hover:bg-gray-50 transition-colors duration-200 rounded-md px-3 ${
                      location.pathname === item.url ? "bg-blue-50" : ""
                    }`}
                  >
                    {item.external ? (
                      <a
                        href={item.url}
                        className="flex items-center gap-3"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {Icon && <Icon className="h-4 w-4 text-blue-600" />}
                        <span>{item.title}</span>
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
                          className="text-gray-400"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    ) : (
                      <Link
                        to={item.url}
                        className="flex items-center gap-3"
                        state={
                          item.requiresAuth && !isAuthenticated
                            ? { from: location.pathname }
                            : undefined
                        }
                      >
                        {Icon && <Icon className="h-4 w-4 text-blue-600" />}
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                )}

                {item.items?.length ? (
                  <DropdownMenuContent
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                    className="min-w-56 rounded-lg border border-gray-200 shadow-lg"
                  >
                    {item.items.map((subItem) => {
                      const SubIcon = subItem.icon;

                      return (
                        <DropdownMenuItem
                          asChild
                          key={subItem.title}
                          className="py-2 px-3 focus:bg-blue-50 focus:text-blue-700 cursor-pointer"
                        >
                          {subItem.external ? (
                            <a
                              href={subItem.url}
                              className="flex items-center gap-2"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {SubIcon && (
                                <SubIcon className="h-4 w-4 text-blue-600" />
                              )}
                              <span>{subItem.title}</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-gray-400"
                              >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                            </a>
                          ) : (
                            <Link
                              to={subItem.url}
                              className="flex items-center gap-2"
                              state={
                                subItem.requiresAuth && !isAuthenticated
                                  ? { from: location.pathname }
                                  : undefined
                              }
                            >
                              {SubIcon && (
                                <SubIcon className="h-4 w-4 text-blue-600" />
                              )}
                              <span>{subItem.title}</span>
                            </Link>
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                ) : null}
              </SidebarMenuItem>
            </DropdownMenu>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
