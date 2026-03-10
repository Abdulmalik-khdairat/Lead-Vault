import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Hexagon, LayoutDashboard, LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const { user, isLoading } = useAuth();

  return (
    <nav className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Hexagon size={20} className="fill-current" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">LeadFlow</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!isLoading && (
            user ? (
              <Link href="/admin" className="flex">
                <Button variant="ghost" className="gap-2 font-medium">
                  <LayoutDashboard size={18} />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Button 
                variant="default" 
                className="gap-2 font-medium shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                onClick={() => window.location.href = '/api/login'}
              >
                <LogIn size={18} />
                Admin Login
              </Button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
