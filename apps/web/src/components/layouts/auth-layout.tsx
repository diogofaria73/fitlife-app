import { ThemeToggle } from '../theme-toggle';
import { Dumbbell } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * AuthLayout Component
 * Layout for authentication pages (login, register)
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-8 w-8 text-primary animate-pulse" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            FitLife
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full p-4 text-center text-sm text-muted-foreground">
        <p>2026 FitLife. Transforme seu corpo, transforme sua vida.</p>
      </footer>
    </div>
  );
}
