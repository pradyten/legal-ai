'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-background p-6">
          <Card className="max-w-2xl w-full border-error-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-error-600">
                <div className="h-12 w-12 rounded-full bg-error-50 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xl">Something went wrong</p>
                  <p className="text-sm font-normal text-muted-foreground mt-1">
                    An unexpected error occurred in the application
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-sm font-mono text-foreground/90">
                  {this.state.error?.message || 'Unknown error'}
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="text-xs text-muted-foreground">
                  <summary className="cursor-pointer font-medium mb-2">
                    Stack trace (development only)
                  </summary>
                  <pre className="bg-muted/50 rounded-md p-3 overflow-auto border border-border">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="bg-warning-50 border border-warning-600/20 rounded-lg p-3">
                <p className="text-xs text-warning-700">
                  <strong>Note:</strong> This error has been logged. If the problem persists after
                  reloading, please contact support.
                </p>
              </div>
            </CardContent>
            <CardFooter className="gap-3">
              <Button onClick={this.handleReset} variant="outline" className="gap-2">
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
