
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Grid, 
  Box, 
  BookOpen, 
  Cpu,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Grid, label: "My Agents", path: "/agents" },
    { icon: Box, label: "Components", path: "/components" },
    { icon: BookOpen, label: "Templates", path: "/templates" },
    { icon: Cpu, label: "AI Models", path: "/models" },
    { icon: Users, label: "Community", path: "/community" },
  ];
  
  return (
    <aside className="w-64 border-r bg-muted/40 hidden md:block">
      <div className="h-full py-6 px-4 flex flex-col space-y-6">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                location.pathname === item.path && "bg-muted"
              )}
              asChild
            >
              <Link to={item.path} className="flex items-center space-x-3">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
        
        <div className="mt-auto">
          <div className="rounded-lg bg-gradient-to-br from-garden-purple/10 to-garden-teal/10 p-4">
            <h3 className="font-medium mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Check our documentation or join the community for support.
            </p>
            <Button variant="outline" size="sm" className="w-full">View Docs</Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
