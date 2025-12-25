// src/renderer/context/MqttContext.tsx

/*
import { useMqtt } from '../../context/MqttContext';
import type { MqttMessage, MqttSubscription } from '../../types/global';
*/
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from 'react';
//import type { MqttMessage } from '../types/global';
import type { MqttMessage, MqttSubscription } from '../types/global';

import type { MqttConnectionProfile } from '../views/Settings/subviews/types';

/* ===================== TYPES ===================== */

export interface TopicInfo {
  topic: string;
  count: number;
}

interface MqttContextType {
  connected: boolean;
  clientProfile: MqttConnectionProfile | null;

  /* Messages */
  messages: MqttMessage[];
  topicsWithMessages: TopicInfo[];

  /* Subscriptions */
  subscriptions: MqttSubscription[];

  /* Connection */
  setConnected: (val: boolean) => void;
  setClientProfile: (profile: MqttConnectionProfile | null) => void;

  /* Message handling */
  addMessage: (msg: MqttMessage) => void;
  clearMessages: () => void;

  /* Subscription handling */
  addSubscription: (sub: MqttSubscription) => void;
  removeSubscription: (topic: string) => void;

  /* JSON editor */
  editorMessage: MqttMessage | null;
  copyToEditor: (message: MqttMessage) => void;
}

/* ===================== CONTEXT ===================== */

const MqttContext = createContext<MqttContextType | undefined>(undefined);

/* ===================== PROVIDER ===================== */

export const MqttProvider = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState(false);
  const [clientProfile, setClientProfile] =
    useState<MqttConnectionProfile | null>(null);

  const [messages, setMessages] = useState<MqttMessage[]>([]);
  const [subscriptions, setSubscriptions] = useState<MqttSubscription[]>([]);
  const [editorMessage, setEditorMessage] = useState<MqttMessage | null>(null);

  /* ---------- Messages ---------- */
  const addMessage = (msg: MqttMessage) =>
    setMessages((prev) => [...prev, msg]);

  const clearMessages = () => setMessages([]);

  /* ---------- Subscriptions ---------- */
  const addSubscription = (sub: MqttSubscription) =>
    setSubscriptions((prev) =>
      prev.some((s) => s.topic === sub.topic) ? prev : [...prev, sub],
    );

  const removeSubscription = (topic: string) =>
    setSubscriptions((prev) => prev.filter((s) => s.topic !== topic));

  /* ---------- JSON editor ---------- */
  const copyToEditor = (message: MqttMessage) => setEditorMessage(message);

  /* ---------- Derived topic stats ---------- */
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

  /* ---------- MQTT message listener ---------- */
  useEffect(() => {
    const handleMessage = (msg: MqttMessage) => {
      console.log('MQTT Context received message:', msg); // 🔥 add debug log
      addMessage(msg);
    };
    window.mqttAPI.onMessage(handleMessage);

    return () => {
      // if supported:
      // window.mqttAPI.offMessage(handleMessage);
    };
  }, []);

  /* ---------- PROVIDER VALUE ---------- */
  const contextValue: MqttContextType = {
    connected,
    clientProfile,
    messages,
    topicsWithMessages,
    subscriptions,
    setConnected,
    setClientProfile,
    addMessage,
    clearMessages,
    addSubscription,
    removeSubscription,
    editorMessage,
    copyToEditor,
  };

  return (
    <MqttContext.Provider value={contextValue}>{children}</MqttContext.Provider>
  );
};

/* ===================== HOOK ===================== */
export const useMqtt = () => {
  const ctx = useContext(MqttContext);
  if (!ctx) throw new Error('useMqtt must be used within MqttProvider');
  return ctx;
};
