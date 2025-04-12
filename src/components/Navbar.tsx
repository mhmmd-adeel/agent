
import React from "react";
import { Button } from "@/components/ui/button";
import { Home, Plus, Settings, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-garden-purple to-garden-teal flex items-center justify-center">
              <span className="text-white font-bold">AG</span>
            </div>
            <span className="font-bold text-xl">Agent Garden</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          
          <Button asChild>
            <Link to="/builder/new">
              <Plus className="h-5 w-5 mr-2" />
              <span>New Agent</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
