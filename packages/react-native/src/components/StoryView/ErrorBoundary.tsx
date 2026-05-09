import React, { ErrorInfo, ReactNode } from 'react';
import { View, Text } from 'react-native';

export class ErrorBoundary extends React.Component<
  { children: ReactNode | ReactNode[]; onError: (error: Error, stack: string) => void },
  { hasError: boolean }
> {
  constructor(props: {
    children: ReactNode | ReactNode[];
    onError: (error: Error, stack: string) => void;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError(error, info.componentStack as string);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            margin: 16,
            padding: 16,
            borderColor: 'red',
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>Something went wrong rendering your story</Text>
        </View>
      );
    }

    return this.props.children;
  }
}
