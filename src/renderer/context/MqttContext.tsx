// src/renderer/context/MqttContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
import type { MqttMessage } from '../types/global';
import type { MqttConnectionProfile } from '../views/Settings/subviews/types';

export interface TopicInfo {
  topic: string;
  count: number;
}

interface MqttContextType {
  connected: boolean;
  clientProfile: MqttConnectionProfile | null;

  messages: MqttMessage[];
  topicsWithMessages: TopicInfo[];

  subscribedTopics: string[];

  setConnected: (val: boolean) => void;
  setClientProfile: (profile: MqttConnectionProfile | null) => void;

  addMessage: (msg: MqttMessage) => void;
  addSubscribedTopic: (topic: string) => void;
  clearMessages: () => void;

  editorMessage: MqttMessage | null;
  copyToEditor: (message: MqttMessage) => void;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const MqttProvider = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState(false);
  const [clientProfile, setClientProfile] =
    useState<MqttConnectionProfile | null>(null);

  const [messages, setMessages] = useState<MqttMessage[]>([]);
  const [subscribedTopics, setSubscribedTopics] = useState<string[]>([]);
  const [editorMessage, setEditorMessage] = useState<MqttMessage | null>(null);

  const addMessage = (msg: MqttMessage) =>
    setMessages((prev) => [...prev, msg]);

  const addSubscribedTopic = (topic: string) =>
    setSubscribedTopics((prev) =>
      prev.includes(topic) ? prev : [...prev, topic],
    );

  const clearMessages = () => setMessages([]);

  const copyToEditor = (message: MqttMessage) => {
    setEditorMessage(message);
  };

  /**
   * Derive topics + message counts
   * O(n) per message batch, memoized
   */
  const topicsWithMessages = useMemo(() => {
    const map = new Map<string, number>();

    for (const msg of messages) {
      map.set(msg.topic, (map.get(msg.topic) ?? 0) + 1);
    }

    return Array.from(map.entries()).map(([topic, count]) => ({
      topic,
      count,
    }));
  }, [messages]);

  // Listen to incoming MQTT messages
  useEffect(() => {
    const handleMessage = (msg: MqttMessage) => addMessage(msg);
    window.mqttAPI.onMessage(handleMessage);

    return () => {
      // If your preload supports it, remove listener here
    };
  }, []);

  return (
    <MqttContext.Provider
      value={{
        connected,
        clientProfile,

        messages,
        topicsWithMessages,

        subscribedTopics,

        setConnected,
        setClientProfile,
        addMessage,
        addSubscribedTopic,
        clearMessages,

        editorMessage,
        copyToEditor,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => {
  const ctx = useContext(MqttContext);
  if (!ctx) throw new Error('useMqtt must be used within MqttProvider');
  return ctx;
};
