import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-lg font-display font-bold mb-1">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            An unexpected error occurred. Please try again.
          </p>
          <Button onClick={this.handleReset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          {this.state.error && (
            <p className="text-xs text-muted-foreground/50 mt-4 font-mono max-w-sm truncate">
              {this.state.error.message}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
