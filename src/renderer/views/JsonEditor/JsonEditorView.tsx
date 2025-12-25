import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, IconButton, Alert, Tooltip } from '@mui/joy';
import { ContentPasteGo, FormatColorFill } from '@mui/icons-material';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { useMqtt } from '../../context/MqttContext';
import { DarkTextField } from '../../components/form/LabeledTextField';
import PageLayout from '../../layout/PageLaout';

export default function JsonEditorView() {
  const { editorMessage, connected } = useMqtt();

  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  // Load incoming message
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

  const formatJson = () => {
    try {
      const parsed = JSON.parse(message);
      setMessage(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch {
      setError('Cannot format invalid JSON');
    }
  };

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
    <PageLayout title="JSON Editor">
      {/* Scrollable body */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto', // ✅ ONLY scroll area
          p: 2,
        }}
      >
        <Box>
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
                sx={{
                  borderColor: '#1e293b',
                  color: '#e5e7eb',
                  '&:hover': {
                    bgcolor: '#1e293b',
                  },
                }}
              >
                <ContentPasteGo />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        {/* ===== BODY ===== */}
        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          p={3}
          overflow="hidden"
        >
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
            sx={{
              overflow: 'auto',
              border: '1px solid #1e293b',
              borderRadius: 1,
            }}
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

          {/* Publish button sticky at bottom */}
          <Box flexShrink={0}>
            <Button
              variant="solid"
              disabled={
                !connected || !!error || !message.trim() || !topic.trim()
              }
              onClick={handlePublish}
              sx={{ width: 120 }}
            >
              Publish
            </Button>
          </Box>
        </Box>
      </Box>
    </PageLayout>
  );
}
