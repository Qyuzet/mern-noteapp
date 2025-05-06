import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInput } from "@/components/ui/sidebar";
import { Mail, Bell } from "lucide-react";

export function SidebarOptInForm() {
  return (
    <Card className="shadow-none border border-blue-100 bg-blue-50/50 overflow-hidden">
      <form>
        <CardHeader className="p-4 pb-0 space-y-1">
          <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-1.5">
            <Bell className="h-3.5 w-3.5 text-blue-600" />
            Get Task Updates
          </CardTitle>
          <CardDescription className="text-xs text-blue-700/70">
            Receive notifications for new features and tips
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2.5 p-4">
          <div className="relative">
            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <SidebarInput
              type="email"
              placeholder="Your email address"
              className="pl-9 border-blue-200 focus:border-blue-400 text-sm"
            />
          </div>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
            size="sm"
          >
            Subscribe
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
