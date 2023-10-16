import React, { ReactNode } from 'react';
import { Text } from 'react-native';

export class ErrorBoundary extends React.Component<
  { children: ReactNode | ReactNode[] },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.warn(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Text>Something went wrong rendering your story</Text>;
    }

    return this.props.children;
  }
}
