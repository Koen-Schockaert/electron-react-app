// src/renderer/views/MqttView.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../layout/PageLaout';

import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Tooltip,
} from '@mui/material';
import { Pause, PlayArrow, ArrowDownward, Clear } from '@mui/icons-material';
import { Chip, Divider } from '@mui/joy';
import { useMqtt } from '../../context/MqttContext';
import type {
  MqttMessage,
  MqttSubscription,
  TopicInfo,
} from '../../types/global';

const SCROLL_THRESHOLD = 80;

const MqttView: React.FC = () => {
  const {
    connected,
    clientProfile,
    messages,
    topicsWithMessages,
    subscriptions,
    addSubscription,
    removeSubscription,
    clearMessages,
    copyToEditor,
  } = useMqtt();

  const navigate = useNavigate();

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const [newTopic, setNewTopic] = useState('');
  const [publishTopic, setPublishTopic] = useState('');
  const [publishMessage, setPublishMessage] = useState('');

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* ================= DEBUG LOG ================= */
  useEffect(() => {
    console.log('Received messages:', messages);
  }, [messages]);

  /* ================= FILTERED MESSAGES ================= */
  const filteredMessages = useMemo(() => {
    if (!selectedTopic) return messages;
    return messages.filter((m) => m.topic === selectedTopic);
  }, [messages, selectedTopic]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    if (paused) return;
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [filteredMessages, paused]);

  const onScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
    setShowScrollDown(!atBottom);
  };

  if (!connected) {
    return (
      <Box p={3}>
        <Typography color="warning.main">
          Not connected to an MQTT broker
        </Typography>
      </Box>
    );
  }

  /* ================= DISCOVERED TOPICS ================= */
  const discoveredTopics = useMemo(() => {
    return topicsWithMessages.filter(
      (t) => !subscriptions.some((s) => s.topic === t.topic),
    );
  }, [topicsWithMessages, subscriptions]);

  return (
    <PageLayout
      title="MQTT Messages"
      headerRight={
        <>
          <Chip size="sm">{filteredMessages.length} msgs</Chip>
          <IconButton
            size="small"
            onClick={() => setPaused((p) => !p)}
            sx={{
              color: '#9ca3af', // 👈 visible but inactive
              '&:hover': {
                color: '#e5e7eb', // 👈 active on hover
                bgcolor: '#020617',
              },
            }}
          >
            {paused ? <PlayArrow /> : <Pause />}
          </IconButton>

          <IconButton
            size="small"
            onClick={clearMessages}
            sx={{
              color: '#9ca3af',
              '&:hover': {
                color: '#f87171', // danger hint
                bgcolor: '#020617',
              },
            }}
          >
            <Clear />
          </IconButton>
        </>
      }
    >
      {/* ===== BODY ===== */}
      <Box display="flex" flex={1} minHeight={0} overflow="hidden">
        {/* ================= LEFT ================= */}
        <Box
          width={300}
          display="flex"
          flexDirection="column"
          minHeight={0}
          bgcolor="#020617"
          borderRight="1px solid #1e293b"
        >
          {/* ---- SUBSCRIPTIONS ---- */}
          <Box display="flex" flexDirection="column" flex={1} minHeight={0}>
            <Typography
              px={2}
              py={1}
              fontSize={13}
              color="gray"
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                bgcolor: '#020617',
                borderBottom: '1px solid #1e293b',
              }}
            >
              Subscriptions
            </Typography>

            <Box flex={1} minHeight={0} overflow="auto">
              <List dense disablePadding>
                {subscriptions.map((sub) => (
                  <ListItem key={sub.topic} disablePadding>
                    <ListItemButton
                      selected={selectedTopic === sub.topic}
                      onClick={() =>
                        setSelectedTopic(
                          selectedTopic === sub.topic ? null : sub.topic,
                        )
                      }
                    >
                      <Typography fontSize={13}>{sub.topic}</Typography>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>

          {/* ---- DISCOVERED TOPICS ---- */}
          {discoveredTopics.length > 0 && (
            <Box
              display="flex"
              flexDirection="column"
              flex={1}
              minHeight={0}
              borderTop="1px solid #1e293b"
            >
              <Typography
                px={2}
                py={1}
                fontSize={13}
                color="gray"
                sx={{
                  position: 'sticky',
                  top: 32, // 👈 height of first header
                  zIndex: 1,
                  bgcolor: '#020617',
                  borderBottom: '1px solid #1e293b',
                }}
              >
                Discovered Topics
              </Typography>

              <Box flex={1} minHeight={0} overflow="auto">
                <List dense disablePadding>
                  {discoveredTopics.map((t) => (
                    <ListItem key={t.topic} disablePadding>
                      <ListItemButton
                        selected={selectedTopic === t.topic}
                        onClick={() => setSelectedTopic(t.topic)}
                      >
                        <Box
                          width="100%"
                          display="flex"
                          justifyContent="space-between"
                        >
                          <Typography fontSize={13}>{t.topic}</Typography>
                          <Typography fontSize={11} color="gray">
                            {t.count} msgs
                          </Typography>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}

          {/* ---- FIXED FOOTER ---- */}
          <Box px={2} py={1} borderTop="1px solid #1e293b" flexShrink={0}>
            <Typography fontSize={12} color="gray">
              Add subscription
            </Typography>

            <Box display="flex" gap={1} mt={0.5}>
              <input
                style={{
                  flex: 1,
                  padding: '4px 8px',
                  background: '#0f172a',
                  color: '#e5e7eb',
                  border: '1px solid #1e293b',
                  borderRadius: 4,
                }}
                placeholder="Topic..."
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
              />

              <Button
                size="small"
                variant="contained"
                onClick={async () => {
                  if (!newTopic) return;
                  await window.mqttAPI.subscribe(newTopic, 0);
                  addSubscription({ topic: newTopic, qos: 0 });
                  setNewTopic('');
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Box>

        {/* ================= RIGHT ================= */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          minHeight={0}
          position="relative"
        >
          {/* ---- PUBLISH ---- */}
          <Box
            px={2}
            py={1}
            borderBottom="1px solid #1e293b"
            display="flex"
            gap={1}
            flexShrink={0}
          >
            <input
              style={{
                flex: 1,
                padding: '4px 8px',
                background: '#0f172a',
                color: '#e5e7eb',
                border: '1px solid #1e293b',
                borderRadius: 4,
              }}
              placeholder="Topic..."
              value={publishTopic}
              onChange={(e) => setPublishTopic(e.target.value)}
            />
            <input
              style={{
                flex: 2,
                padding: '4px 8px',
                background: '#0f172a',
                color: '#e5e7eb',
                border: '1px solid #1e293b',
                borderRadius: 4,
              }}
              placeholder="Message..."
              value={publishMessage}
              onChange={(e) => setPublishMessage(e.target.value)}
            />
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                if (!publishTopic || !publishMessage) return;
                window.mqttAPI.publish(publishTopic, publishMessage);
                setPublishMessage('');
              }}
            >
              Publish
            </Button>
          </Box>

          {/* ---- MESSAGES (SCROLL ONLY HERE) ---- */}
          <Box
            ref={scrollRef}
            onScroll={onScroll}
            flex={1}
            minHeight={0}
            overflow="auto"
            px={2}
            py={1}
            
          >
            {filteredMessages.map((m: MqttMessage, idx: number) => (
              <Box
                key={`${m.topic}-${idx}`}
                mb={1}
                p={1}
                borderRadius={1}
                bgcolor="#020617"
                border="1px solid #1e293b"

              >
                <Typography fontSize={12} fontWeight={600}>
                  {m.topic}
                </Typography>
                <Typography fontSize={12} color="gray" whiteSpace="pre-wrap">
                  {m.message}
                </Typography>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    copyToEditor(m);
                    navigate('/json-editor');
                  }}
                >
                  Copy
                </Button>
              </Box>
            ))}
            <div ref={bottomRef} />
          </Box>

          {showScrollDown && (
            <IconButton
              size="small"
              onClick={() =>
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
              }
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                bgcolor: '#020617',
                border: '1px solid #1e293b',
              }}
            >
              <ArrowDownward />
            </IconButton>
          )}
        </Box>
      </Box>
    </PageLayout>
  );
};

export default MqttView;
