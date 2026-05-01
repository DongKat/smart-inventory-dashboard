import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border bg-white p-8" role="alert">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Something went wrong</h2>
          <p className="mb-4 text-sm text-slate-500">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <Button onClick={this.handleRetry}>Try Again</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
