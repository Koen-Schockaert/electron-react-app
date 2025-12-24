import React, { useState } from 'react';
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import { useMqtt } from '../../context/MqttContext';
import { Chip } from '@mui/joy';

const MqttView: React.FC = () => {
  const { messages, subscribedTopics, clearMessages, addSubscribedTopic } =
    useMqtt();

  const [subscribeTopic, setSubscribeTopic] = useState('');
  const [publishTopic, setPublishTopic] = useState('');
  const [publishMessage, setPublishMessage] = useState('');
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const { connected, clientProfile } = useMqtt();

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubscribe = async () => {
    if (!subscribeTopic.trim())
      return alert('Please enter a topic to subscribe.');
    try {
      await window.mqttAPI.subscribe(subscribeTopic);
      addSubscribedTopic(subscribeTopic);
      setSubscribeTopic('');
    } catch (err: any) {
      alert('Subscribe failed: ' + err);
    }
  };

  const handlePublish = async () => {
    if (!publishTopic.trim()) return alert('Please enter a topic to publish.');
    try {
      await window.mqttAPI.publish(publishTopic, publishMessage);
      setPublishMessage('');
    } catch (err: any) {
      alert('Publish failed: ' + err);
    }
  };

  function formatPayload(payload: string) {
    try {
      const parsed = JSON.parse(payload);
      return {
        isJson: true,
        formatted: JSON.stringify(parsed, null, 2),
      };
    } catch {
      return {
        isJson: false,
        formatted: payload,
      };
    }
  }

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
    <Box sx={{ p: 3 }}>
      <Chip color={connected ? 'success' : 'danger'} variant="soft">
        {connected
          ? `Connected to "${clientProfile?.name ?? 'Unknown profile'}"`
          : 'MQTT Disconnected'}
      </Chip>
      <Typography variant="h5" gutterBottom>
        MQTT Live Messages 
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Subscribe Topic"
          value={subscribeTopic}
          onChange={(e) => setSubscribeTopic(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleSubscribe}>
          Subscribe
        </Button>
      </Box>

      {subscribedTopics.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">Subscribed Topics:</Typography>
          <List
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {subscribedTopics.map((t) => (
              <ListItem
                key={t}
                component="div"
                onClick={() => setPublishTopic(t)}
                sx={{
                  width: 'auto',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  px: 1,
                  cursor: 'pointer',
                }}
              >
                <ListItemText primary={t} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Publish Topic"
          value={publishTopic}
          onChange={(e) => setPublishTopic(e.target.value)}
          fullWidth
        />
        <TextField
          label="Message"
          value={publishMessage}
          onChange={(e) => setPublishMessage(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handlePublish}>
          Publish
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        Messages
      </Typography>
      <Button
        variant="outlined"
        color="warning"
        onClick={clearMessages}
        disabled={!messages.length}
      >
        Clear
      </Button>
      <Box
        sx={{
          maxHeight: 400,
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: 1,
        }}
      >
        <List>
          {messages.map((m, index) => {
            const payload = formatPayload(m.message);

            return (
              <ListItem key={index} divider alignItems="flex-start">
                <Box sx={{ width: '100%' }}>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    {m.topic}
                  </Typography>

                  <Box
                    sx={{
                      mt: 0.5,
                      p: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      whiteSpace: 'pre-wrap',
                      bgcolor: payload.isJson
                        ? 'neutral.softBg'
                        : 'background.level1',
                      borderRadius: 1,
                    }}
                  >
                    {payload.formatted}
                  </Box>
                </Box>
              </ListItem>
            );
          })}

          <div ref={messagesEndRef} />
        </List>
      </Box>
    </Box>
  );
};

export default MqttView;
