import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import magnifyingGlassIcon from "@/assets/magnifying-glass.png";

const CrediScopeAIHeader = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("home");

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={magnifyingGlassIcon} 
              alt="CrediScopeAI Logo"
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-foreground">CrediScope AI</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/archive"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/archive") ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground"
              }`}
            >
              Archive
            </Link>
            <Link
              to="/learn"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/learn") ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground"
              }`}
            >
              Learn
            </Link>
            <Link
              to="/authority"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/authority") ? "text-primary border-b-2 border-primary pb-1" : "text-muted-foreground"
              }`}
            >
              Authority
            </Link>
            
            {/* Language Chip */}
            <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
              हिं
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="outline" size="sm" className="md:hidden">
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
};

export default CrediScopeAIHeader;