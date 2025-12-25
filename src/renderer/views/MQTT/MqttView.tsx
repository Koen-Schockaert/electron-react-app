import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  UIEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
} from '@mui/material';
import { Chip, Switch } from '@mui/joy';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { useMqtt } from '../../context/MqttContext';

const SCROLL_THRESHOLD_PX = 40;

const MqttView: React.FC = () => {
  const navigate = useNavigate();

  const {
    connected,
    clientProfile,
    messages,
    topicsWithMessages,
    subscribedTopics,
    clearMessages,
    addSubscribedTopic,
    copyToEditor,
  } = useMqtt();

  const [subscribeTopic, setSubscribeTopic] = useState('');
  const [publishTopic, setPublishTopic] = useState('');
  const [publishMessage, setPublishMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /**
   * Filter messages by topic (derived, cheap)
   */
  const filteredMessages = useMemo(() => {
    if (!selectedTopic) return messages;
    return messages.filter((m) => m.topic === selectedTopic);
  }, [messages, selectedTopic]);

  /**
   * Auto-scroll only when enabled
   */
  useEffect(() => {
    if (!autoScroll) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [filteredMessages, autoScroll]);

  /**
   * Detect manual scroll to disable auto-scroll
   */
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight <
      SCROLL_THRESHOLD_PX;

    setShowScrollToBottom(!atBottom);
    setAutoScroll(atBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setAutoScroll(true);
    setShowScrollToBottom(false);
  };

  const handleSubscribe = async () => {
    if (!subscribeTopic.trim()) return;

    await window.mqttAPI.subscribe(subscribeTopic);
    addSubscribedTopic(subscribeTopic);
    setSubscribeTopic('');
  };

  const handlePublish = async () => {
    if (!publishTopic.trim()) return;

    await window.mqttAPI.publish(publishTopic, publishMessage);
    setPublishMessage('');
  };

  if (!connected) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="warning">
          Not connected to an MQTT broker.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      {/* ================= HEADER + CONTROLS ================= */}
      <Box sx={{ p: 2, borderBottom: '1px solid #ddd', flexShrink: 0 }}>
        <Chip color="success" variant="soft" sx={{ mb: 1 }}>
          Connected to "{clientProfile?.name ?? 'Unknown profile'}"
        </Chip>

        <Typography variant="h5" gutterBottom>
          MQTT Live Messages
        </Typography>

        {/* Subscribe */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            size="small"
            label="Subscribe Topic"
            value={subscribeTopic}
            onChange={(e) => setSubscribeTopic(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleSubscribe}>
            Subscribe
          </Button>
        </Box>

        {/* Publish */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            size="small"
            label="Publish Topic"
            value={publishTopic}
            onChange={(e) => setPublishTopic(e.target.value)}
            fullWidth
          />
          <TextField
            size="small"
            label="Message"
            value={publishMessage}
            onChange={(e) => setPublishMessage(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handlePublish}>
            Publish
          </Button>
        </Box>

        {/* ================= SUBSCRIBED TOPICS ================= */}
{subscribedTopics.length > 0 && (
  <Box sx={{ mt: 1 }}>
    <Typography
      variant="body2"
      sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}
    >
      Subscribed Topics
    </Typography>

    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {subscribedTopics.map((topic) => (
        <Chip
          key={topic}
          variant="outlined"
          onClick={() => setPublishTopic(topic)}
          sx={{ cursor: 'pointer' }}
        >
          {topic}
        </Chip>
      ))}
    </Box>
  </Box>
)}


        {/* Topic Filter */}
        <Typography
      variant="body2"
      sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}
    >
      Topics Filter
    </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>

          <Chip
            variant={selectedTopic === null ? 'solid' : 'soft'}
            onClick={() => setSelectedTopic(null)}
          >
            All ({messages.length})
          </Chip>

          {topicsWithMessages.map(({ topic, count }) => (
            <Chip
              key={topic}
              variant={selectedTopic === topic ? 'solid' : 'soft'}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic} ({count})
            </Chip>
          ))}
        </Box>
      </Box>

      {/* ================= MESSAGES ================= */}
      <Box
        ref={scrollContainerRef}
        onScroll={handleScroll}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          position: 'relative',
          fontFamily: 'monospace',
        }}
      >
        {/* Sticky messages header */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: 'background.paper',
            borderBottom: '1px solid #ddd',
            px: 2,
            py: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1">
            Messages ({filteredMessages.length})
            {selectedTopic && ` — ${selectedTopic}`}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch
              checked={autoScroll}
              onChange={() => setAutoScroll((v) => !v)}
              startDecorator={autoScroll ? <PlayArrowIcon /> : <PauseIcon />}
            />
            <Button
              size="small"
              variant="outlined"
              color="warning"
              onClick={() => {
                clearMessages();
                setSelectedTopic(null);
              }}
              disabled={!messages.length}
            >
              Clear
            </Button>
          </Box>
        </Box>

        <List disablePadding>
          {filteredMessages.map((m, index) => (
            <ListItem
              key={`${m.topic}-${index}`}
              sx={{
                borderBottom: '1px solid #eee',
                px: 2,
                py: 0.5,
                display: 'block',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {m.topic}
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => {
                    copyToEditor({ topic: m.topic, message: m.message });
                    navigate('/json-editor');
                  }}
                >
                  Edit JSON
                </Button>
              </Box>

              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {m.message}
              </Typography>
            </ListItem>
          ))}

          <div ref={messagesEndRef} />
        </List>

        {/* Scroll to bottom button */}
        {showScrollToBottom && (
          <Button
            variant="contained"
            size="small"
            onClick={scrollToBottom}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 10,
            }}
            startIcon={<ArrowDownwardIcon />}
          >
            New messages
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default MqttView;
