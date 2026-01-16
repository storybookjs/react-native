import { useCallback, useEffect, useRef, useState } from 'react';
import type { ConnectionStatus, StoryIndex } from '../types';

interface UseWebSocketReturn {
  status: ConnectionStatus;
  storyIndex: StoryIndex | null;
  selectedStoryId: string | null;
  errorMessage: string | null;
  connect: () => void;
  disconnect: () => void;
  selectStory: (storyId: string) => void;
}

/**
 * Manages WebSocket connection to Storybook server
 */
export function useWebSocket(host: string, port: string): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [storyIndex, setStoryIndex] = useState<StoryIndex | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current) wsRef.current.close();

    setStatus('connecting');
    setErrorMessage(null);

    try {
      const ws = new WebSocket(`ws://${host}:${port}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        ws.send(
          JSON.stringify({
            type: 'RN_GET_INDEX',
            args: [],
            from: 'storybook-dev-tools',
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'RN_GET_INDEX_RESPONSE' && data.from !== 'storybook-dev-tools') {
            if (data.args?.[0]?.index) {
              setStoryIndex(data.args[0].index);
            }
          }

          if (data.type === 'setCurrentStory' || data.type === 'SET_CURRENT_STORY') {
            const storyId = data.args?.[0]?.storyId;
            if (storyId) setSelectedStoryId(storyId);
          }
        } catch {
          // Non-JSON message
        }
      };

      ws.onerror = () => {
        setStatus('error');
        setErrorMessage('Connection failed. Is the Storybook server running?');
      };

      ws.onclose = () => {
        if (wsRef.current === ws) {
          setStatus((prev) => (prev === 'error' ? 'error' : 'disconnected'));
          wsRef.current = null;
        }
      };
    } catch (error) {
      setStatus('error');
      setErrorMessage(`Failed to connect: ${error}`);
    }
  }, [host, port]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
    setStoryIndex(null);
    setSelectedStoryId(null);
  }, []);

  const selectStory = useCallback((storyId: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(
      JSON.stringify({
        type: 'setCurrentStory',
        args: [{ viewMode: 'story', storyId }],
        from: 'storybook-dev-tools',
      })
    );
    setSelectedStoryId(storyId);
  }, []);

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return {
    status,
    storyIndex,
    selectedStoryId,
    errorMessage,
    connect,
    disconnect,
    selectStory,
  };
}
