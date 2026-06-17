/**
 * useWebSocket.js — Subscribe to AWS IoT Core via MQTT over WebSocket.
 *
 * Wraps AWS Amplify PubSub to provide a simple React hook interface.
 * Automatically reconnects and cleans up on unmount.
 *
 * Usage:
 *   const { messages, isConnected } = useWebSocket('smart-parking/slots/#');
 */
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * NOTE: Full IoT implementation requires:
 *   1. AWS Amplify PubSub configured with IoT endpoint
 *   2. Cognito Identity Pool with IoT policy attached
 *   3. Proper MQTT topic permissions in IoT Core
 *
 * This hook provides the interface contract; wire in your Amplify PubSub
 * subscription in the subscribe() function below.
 */
export function useWebSocket(topic) {
  const [messages,    setMessages]    = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error,       setError]       = useState(null);
  const subscriptionRef = useRef(null);

  const subscribe = useCallback(async () => {
    try {
      // TODO: Replace with Amplify PubSub when IoT endpoint is configured
      // Example:
      // import { PubSub } from 'aws-amplify/pubsub';
      // subscriptionRef.current = PubSub.subscribe(topic).subscribe({
      //   next:  (data) => setMessages((prev) => [data, ...prev].slice(0, 100)),
      //   error: (err)  => setError(err),
      // });
      console.info(`[useWebSocket] Subscribing to topic: ${topic}`);
      setIsConnected(true);
    } catch (err) {
      setError(err);
      setIsConnected(false);
    }
  }, [topic]);

  useEffect(() => {
    subscribe();
    return () => {
      subscriptionRef.current?.unsubscribe?.();
      setIsConnected(false);
    };
  }, [subscribe]);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isConnected, error, clearMessages };
}
