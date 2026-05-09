import React, { ErrorInfo, ReactNode } from 'react';
import { Text } from 'react-native';

export class ErrorBoundary extends React.Component<
  { children: ReactNode | ReactNode[] },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode | ReactNode[] }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.warn(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Text>Something went wrong.</Text>;
    }

    return this.props.children;
  }
}
