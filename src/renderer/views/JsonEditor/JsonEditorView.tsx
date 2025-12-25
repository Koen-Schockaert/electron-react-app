// src/renderer/views/JsonEditorView.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, IconButton, Alert, Tooltip } from '@mui/joy';
import { ContentPasteGo, FormatColorFill } from '@mui/icons-material';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { useMqtt } from '../../context/MqttContext';
import { DarkTextField } from '../../components/form/LabeledTextField';

export default function JsonEditorView() {
  const { editorMessage, connected } = useMqtt();

  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  // Load incoming message from context
  useEffect(() => {
    if (!editorMessage) return;

    setTopic(editorMessage.topic);

    try {
      const parsed = JSON.parse(editorMessage.message);
      setMessage(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch {
      setMessage(editorMessage.message);
      setError('Invalid JSON format');
    }
  }, [editorMessage]);

  // Validate JSON
  const validateJson = (text: string) => {
    try {
      JSON.parse(text);
      setError(null);
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    }
  };

  // Pretty-print JSON
  const formatJson = () => {
    try {
      const parsed = JSON.parse(message);
      setMessage(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch {
      setError('Cannot format invalid JSON');
    }
  };

  // Publish MQTT message
  const handlePublish = async () => {
    if (!connected) return setError('Not connected to MQTT broker');
    if (!topic.trim()) return setError('Topic is required');
    if (!validateJson(message)) return;

    try {
      setPublishing(true);
      await window.mqttAPI.publish(topic, message);
    } catch (err: any) {
      setError(err?.message ?? 'Publish failed');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      bgcolor="#0f172a"
      color="#e5e7eb"
      p={3}
    >
      <Box
        px={2}
        py={1}
        mb={2}
        bgcolor="#020617" // dark header background
        borderBottom="1px solid #1e293b" // subtle border like MQTTView
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography level="h4" sx={{ color: '#e5e7eb', fontWeight: 600 }}>
          JSON Editor
        </Typography>
      </Box>

      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        {editorMessage && (
          <Tooltip title="Copy topic & message">
            <IconButton
              variant="outlined"
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(
                  `Topic: ${editorMessage.topic}\nMessage: ${editorMessage.message}`,
                );
              }}
            >
              <ContentPasteGo />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Error alert */}
      {error && (
        <Alert color="danger" variant="soft" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Topic input */}
      <Box mb={2}>
        <DarkTextField
          label="Topic"
          value={topic}
          onChange={setTopic}
          placeholder="Enter MQTT topic"
          disabled={publishing}
        />
      </Box>

      {/* Controls */}
      <Box display="flex" gap={1} mb={2}>
        <Button
          variant="outlined"
          startDecorator={<FormatColorFill />}
          onClick={formatJson}
          disabled={publishing || !message.trim()}
        >
          Format JSON
        </Button>
      </Box>

      {/* Code editor */}
      <Box
        flex={1}
        mb={2}
        sx={{ height: '100%', border: '1px solid #1e293b', borderRadius: 1 }}
      >
        <CodeMirror
          value={message}
          extensions={[json(), EditorView.lineWrapping]}
          onChange={(value) => {
            setMessage(value);
            validateJson(value);
          }}
          style={{
            height: '100%',
            backgroundColor: '#0f172a',
            color: '#e5e7eb',
            fontFamily: 'monospace',
            borderRadius: 4,
          }}
        />
      </Box>

      {/* Publish button */}
      <Button
        variant="solid"
        disabled={!connected || !!error || !message.trim() || !topic.trim()}
        onClick={handlePublish}
        sx={{ alignSelf: 'flex-start' }}
      >
        Publish
      </Button>
    </Box>
  );
}
