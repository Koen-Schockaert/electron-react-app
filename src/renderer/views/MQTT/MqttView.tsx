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
import type { MqttMessage, TopicTreeItem } from '../../types/global';
import { TopicTree } from './TopicTreeComponent';

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
    removeMessages,
    clearMessages,
    copyToEditor,
  } = useMqtt();

  const navigate = useNavigate();

  const [subscribedSelectedTopics, setSubscibedSelectedTopics] = useState<
    Set<string>
  >(new Set());
  const [discoveredSelectedTopics, setDiscoveredSelectedTopics] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('mqtt.discoveredSelected');
      if (raw) return new Set(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
    return new Set();
  });

  // persist discovered selection so it can be restored when returning to this view
  useEffect(() => {
    try {
      localStorage.setItem(
        'mqtt.discoveredSelected',
        JSON.stringify([...discoveredSelectedTopics]),
      );
    } catch (e) {
      /* ignore */
    }
  }, [discoveredSelectedTopics]);

  const [paused, setPaused] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const [newTopic, setNewTopic] = useState('');
  const [publishTopic, setPublishTopic] = useState('');
  const [publishMessage, setPublishMessage] = useState('');

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('mqttTopicTreeExpanded');
      if (raw) return new Set(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
    return new Set();
  });

  useEffect(() => {
    try {
      localStorage.setItem('mqttTopicTreeExpanded', JSON.stringify([...expandedTopics]));
    } catch (e) {
      // ignore
    }
  }, [expandedTopics]);

  /* ================= DEBUG LOG ================= */
  useEffect(() => {
    console.log('Received messages:', messages);
  }, [messages]);

  // Precompute selected topics into arrays once
  const selectedFilters = useMemo(() => {
    return [...discoveredSelectedTopics, ...subscribedSelectedTopics].map((t) =>
      t.split('/'),
    );
  }, [discoveredSelectedTopics, subscribedSelectedTopics]);

  function mqttMatch(topicLevels: string[], filterLevels: string[]): boolean {
    const tLen = topicLevels.length;
    const fLen = filterLevels.length;

    for (let i = 0; i < fLen; i++) {
      const f = filterLevels[i];
      if (f === '#') return true; // # matches everything from here
      if (f === '+') continue; // + matches any single level
      if (i >= tLen || topicLevels[i] !== f) return false;
    }

    return tLen === fLen; // must match length if no #
  }

  function getAllDescendantTopics(
    items: TopicTreeItem[],
    selectedIds: Set<string>,
  ): string[] {
    const result: string[] = [];

    function traverse(node: TopicTreeItem) {
      if (selectedIds.has(node.id)) {
        collectAll(node);
      } else if (node.children) {
        node.children.forEach(traverse);
      }
    }

    function collectAll(node: TopicTreeItem) {
      result.push(node.id);
      if (node.children) node.children.forEach(collectAll);
    }

    items.forEach(traverse);
    return result;
  }

  const filteredMessages = useMemo(() => {
    if (selectedFilters.length === 0) return messages;

    if (discoveredSelectedTopics.size > 0) {
      return messages.filter((m) =>
        [...discoveredSelectedTopics].some(
          (topic) => m.topic === topic || m.topic.startsWith(topic + '/'),
        ),
      );
    } else {
      return messages.filter((m) => {
        const topicLevels = m.topic.split('/');
        return selectedFilters.some((filterLevels) =>
          mqttMatch(topicLevels, filterLevels),
        );
      });
    }
  }, [messages, selectedFilters]);

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

  const countMessages = (subscription: string) => {
    // Match everything
    if (subscription === '#') {
      return messages.length;
    }

    // Convert MQTT wildcard to RegExp
    const regex = new RegExp(
      '^' +
        subscription
          .replace(/\+/g, '[^/]+') // single-level wildcard
          .replace(/#/g, '.*') + // multi-level wildcard
        '$',
    );

    return messages.filter((m) => regex.test(m.topic)).length;
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

  const setSelectedTopicsA = (selectedTopics: Set<string>) => {
    setSubscibedSelectedTopics(new Set());
    setDiscoveredSelectedTopics(selectedTopics);
  };

  useEffect(() => {
    if (discoveredSelectedTopics.size > 0) {
      setSelectedTopicsA(discoveredSelectedTopics);
    }
  }, [discoveredSelectedTopics]);

  // keep the publish topic input in sync with discovered selection:
  useEffect(() => {
    if (discoveredSelectedTopics.size > 0) {
      // pick the first selected topic to populate the input
      const topic = [...discoveredSelectedTopics][0];
      setPublishTopic(topic);
    }
  }, [discoveredSelectedTopics]);

  /* ================= DISCOVERED TOPICS ================= */
  const discoveredTopics = useMemo(() => {
    return topicsWithMessages.filter(
      (t) => !subscriptions.some((s) => s.topic === t.topic),
    );
  }, [topicsWithMessages, subscriptions]);

  /* ================= TREEBUILDER ================= */

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
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, width: '100%', overflow: 'hidden', overflowX: 'hidden' }}>
        {/* ================= LEFT ================= */}
        <Box
          width={300}
          minWidth={300}
          flexShrink={0}                 // <-- prevent the left pane from shrinking / being scrolled off-screen
          display="flex"
          flexDirection="column"
          minHeight={0}
          bgcolor="#020617"
          borderRight="1px solid #1e293b"
          sx={{ position: 'relative', zIndex: 1 }}
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
                      selected={subscribedSelectedTopics.has(sub.topic)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.18)',
                        },
                      }}
                      onClick={(event) => {
                        setSubscibedSelectedTopics((prev) => {
                          const next = new Set(prev);

                          const isMultiSelect = event.ctrlKey || event.metaKey;

                          if (isMultiSelect) {
                            // toggle only this item
                            if (next.has(sub.topic)) {
                              next.delete(sub.topic);
                            } else {
                              next.add(sub.topic);
                            }
                          } else {
                            // normal click = single selection
                            next.clear();
                            next.add(sub.topic);
                          }

                          return next;
                        });
                        setDiscoveredSelectedTopics(new Set());
                      }}
                    >
                      <Typography
                        fontSize={13}
                        sx={{
                          flexGrow: 1,
                          minWidth: 0, // 🔴 critical for flex overflow
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {sub.topic}
                      </Typography>

                      <Chip size="sm" sx={{ ml: 'auto', mr: 1 }}>
                        {countMessages(sub.topic)} msgs
                      </Chip>
                    </ListItemButton>

                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        minHeight: 24,
                        padding: '2px 6px',
                        fontSize: '0.7rem',
                      }}
                      onClick={async (e) => {
                        e.stopPropagation();

                        if (!sub.topic) return;
                        await window.mqttAPI.unsubscribe(sub.topic);
                        removeSubscription(sub.topic);
                        removeMessages(sub.topic);

                        setSubscibedSelectedTopics((prev) => {
                          const next = new Set(prev);
                          next.delete(sub.topic);
                          return next;
                        });

                        setNewTopic('');
                      }}
                    >
                      Unsubscribe
                    </Button>
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
                <TopicTree
                  topics={discoveredTopics}
                  selectedTopics={discoveredSelectedTopics}
                  setSelectedTopics={setDiscoveredSelectedTopics}
                  expandedTopics={expandedTopics}
                  setExpandedTopics={setExpandedTopics}
                />
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
          minWidth={0}                   // allow the right pane to shrink without causing the whole layout to create a horizontal scrollbar
          display="flex"
          flexDirection="column"
          minHeight={0}
          position="relative"
          sx={{ overflow: 'hidden' }}    // ensure only inner area scrolls
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
                if (!publishTopic) return; // require topic only
                window.mqttAPI.publish(publishTopic, publishMessage ?? '');
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
            px={2}
            py={1}
            sx={{ width: '100%', overflowY: 'auto', overflowX: 'hidden' }} // vertical scroll only here
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
                <Typography
                  fontSize={12}
                  color="gray"
                  sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                >
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
