// src/renderer/views/MqttView.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    copyToEditor
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
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      bgcolor="#0f172a"
      color="#e5e7eb"
    >
      {/* ===== HEADER ===== */}
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        px={2}
        py={1}
        bgcolor="#020617"
        borderBottom="1px solid #1e293b"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography fontWeight={600}>MQTT Messages</Typography>
          <Typography variant="caption" color="gray">
            Connected to {clientProfile?.name}
          </Typography>
        </Box>

        <Box display="flex" gap={1} alignItems="center">
          <Chip size="sm" color="primary" variant="soft">
            {filteredMessages.length} msgs
          </Chip>

          <Tooltip title={paused ? 'Resume scrolling' : 'Pause scrolling'}>
            <IconButton
              onClick={() => setPaused((p) => !p)}
              size="small"
              sx={{ color: '#e5e7eb' }} // Bright light color
            >
              {paused ? <PlayArrow /> : <Pause />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Clear messages">
            <IconButton
              onClick={clearMessages}
              size="small"
              sx={{ color: '#e5e7eb' }} // Bright light color
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ===== BODY ===== */}
      <Box display="flex" flex={1} overflow="hidden">
        {/* ===== LEFT: SUBSCRIPTIONS & DISCOVERED TOPICS ===== */}
        <Box
          width={300}
          borderRight="1px solid #1e293b"
          overflow="auto"
          bgcolor="#020617"
          display="flex"
          flexDirection="column"
        >
          {/* Subscriptions */}
          <Typography px={2} py={1} fontSize={13} color="gray">
            Subscriptions
          </Typography>
          <Box flex={1} overflow="auto">
            <List dense disablePadding>
              {subscriptions.map((sub: MqttSubscription) => {
                const info = topicsWithMessages.find(
                  (t) => t.topic === sub.topic,
                );
                const active = !!info;
                return (
                  <ListItem key={sub.topic} disablePadding>
                    <ListItemButton
                      selected={selectedTopic === sub.topic}
                      onClick={() =>
                        setSelectedTopic(
                          selectedTopic === sub.topic ? null : sub.topic,
                        )
                      }
                    >
                      <Box width="100%">
                        <Typography fontSize={13}>{sub.topic}</Typography>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mt={0.5}
                          gap={1}
                        >
                          <Typography
                            fontSize={11}
                            color={active ? 'success.main' : 'gray'}
                          >
                            {active ? `${info!.count} msgs` : 'inactive'}
                          </Typography>
                          <Chip size="sm" variant="outlined">
                            QoS {sub.qos}
                          </Chip>
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSubscription(sub.topic);
                            }}
                          >
                            Unsub
                          </Button>
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* Discovered topics */}
          {discoveredTopics.length > 0 && (
            <>
              <Divider sx={{ borderColor: '#1e293b' }} />
              <Typography px={2} py={1} fontSize={13} color="gray">
                Discovered Topics
              </Typography>
              <Box flex={1} overflow="auto">
                <List dense disablePadding>
                  {discoveredTopics.map((t: TopicInfo) => (
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
            </>
          )}

          {/* Add new subscription */}
          <Box px={2} py={1} borderTop="1px solid #1e293b">
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

        {/* ===== RIGHT: MESSAGES & PUBLISH ===== */}
        <Box flex={1} position="relative" display="flex" flexDirection="column">
          {/* Publish controls */}
          <Box
            px={2}
            py={1}
            borderBottom="1px solid #1e293b"
            display="flex"
            gap={1}
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

          {/* Messages list */}
          <Box
            ref={scrollRef}
            onScroll={onScroll}
            flex={1}
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

          {/* Scroll to bottom button */}
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
    </Box>
  );
};

export default MqttView;
