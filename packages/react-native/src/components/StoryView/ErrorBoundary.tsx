import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';

export class ErrorBoundary extends React.Component<
  { children: ReactNode | ReactNode[]; onError: (error: Error, stack: string) => void },
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

  componentDidCatch(error, info) {
    this.props.onError(error, info.componentStack);
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
