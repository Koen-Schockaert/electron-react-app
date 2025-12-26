import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, IconButton, Alert, Tooltip } from '@mui/joy';
import { ContentPasteGo, FormatColorFill } from '@mui/icons-material';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { useMqtt } from '../../context/MqttContext';
import { DarkTextField } from '../../components/form/LabeledTextField';
import PageLayout from '../../layout/PageLaout';
import { jsonExtensions } from '../../components/EditorTheme';
import { jsonErrorHighlighter } from '../../components/InvalidJsonHighlighter';

export default function JsonEditorView() {
  const { editorMessage, connected } = useMqtt();

  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [jsonError, setJsonError] = useState<{
    message: string;
    position: number;
  } | null>(null);

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
      setJsonError(null);
      return true;
    } catch (err: any) {
      setError(err.message);
      const match = /at position (\d+)/.exec(err.message);
      const pos = match ? parseInt(match[1], 10) : 0;
      setJsonError({ message: err.message, position: pos });
      return false;
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(message);
      setMessage(JSON.stringify(parsed, null, 2));
      setError(null);
      setJsonError(null);
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
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          p: 2,
        }}
      >
        {/* ===== STICKY ERROR BANNER ===== */}
        {error && (
          <Alert
            color="danger"
            variant="soft"
            sx={{
              flexShrink: 0,
              mb: 1,
              borderRadius: 0,
              borderBottom: '1px solid #7f1d1d',
              bgcolor: '#3f0d12',
              color: '#fecaca',
            }}
          >
            {error}
          </Alert>
        )}

        {/* ===== TOOLBAR (FIXED) ===== */}
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            py: 1,
            mb: 1,
            borderBottom: '1px solid #1e293b',
          }}
        >
          {editorMessage && (
            <Tooltip title="Copy topic & message">
              <IconButton
                variant="outlined"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Topic: ${editorMessage.topic}\nMessage: ${editorMessage.message}`,
                  );
                }}
                sx={{
                  borderColor: '#1e293b',
                  color: '#e5e7eb',
                  '&:hover': { bgcolor: '#1e293b' },
                }}
              >
                <ContentPasteGo />
              </IconButton>
            </Tooltip>
          )}

          <Button
            variant="outlined"
            startDecorator={<FormatColorFill />}
            onClick={formatJson}
            disabled={publishing || !message.trim()}
          >
            Format JSON
          </Button>
        </Box>

        {/* ===== TOPIC INPUT (FIXED) ===== */}
        <Box mb={2} flexShrink={0}>
          <DarkTextField
            label="Topic"
            value={topic}
            onChange={setTopic}
            placeholder="Enter MQTT topic"
            disabled={publishing}
          />
        </Box>

        {/* ===== MESSAGE EDITOR (SCROLLABLE ONLY) ===== */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            border: '1px solid #1e293b',
            borderRadius: 1,
            mb: 2,
            '.cm-json-error': {
              backgroundColor: 'rgba(220, 38, 38, 0.3)', // red-ish background
            },
          }}
        >
          <CodeMirror
            value={message}
            extensions={[
              json(),
              EditorView.lineWrapping,
              jsonExtensions,
              jsonErrorHighlighter(jsonError ? jsonError.position : null),
            ]}
            onChange={(value) => {
              setMessage(value);
              validateJson(value);
            }}
            style={{
              height: '100%',
              backgroundColor: '#0f172a',
              color: '#e5e7eb',
              fontFamily: 'monospace',
            }}
          />
        </Box>

        {/* ===== PUBLISH BUTTON (FIXED) ===== */}
        <Box flexShrink={0}>
          <Button
            variant="solid"
            disabled={!connected || !!error || !message.trim() || !topic.trim()}
            onClick={handlePublish}
            sx={{ width: 120 }}
          >
            Publish
          </Button>
        </Box>
      </Box>
    </PageLayout>
  );
}
