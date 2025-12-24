import { Box, Button, Typography, Alert } from '@mui/joy';
import { useEffect, useState } from 'react';
import { useMqtt } from '../../context/MqttContext';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { LabeledTextField } from '../../components/form/LabeledTextField';

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

  // Format / pretty-print JSON
  const formatJson = () => {
    try {
      const parsed = JSON.parse(message);
      setMessage(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch {
      setError('Cannot format invalid JSON');
    }
  };

  // Publish payload
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
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography level="h4" mb={2}>
        JSON Editor
      </Typography>

      {error && (
        <Alert color="danger" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box mb={2}>
        <LabeledTextField
          label="Topic"
          value={topic}
          onChange={setTopic}
          placeholder="Enter MQTT topic"
          disabled={publishing}
        />
      </Box>

      <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={formatJson} disabled={publishing || !message}>
          Format JSON
        </Button>
      </Box>

      <Box sx={{ flex: 1, mb: 2, height: '100%' }}>
        <Typography level="body-sm" sx={{ mb: 1 }}>
          Message
        </Typography>
        <CodeMirror
          value={message}
          extensions={[json(), EditorView.lineWrapping]}
          onChange={(value) => {
            setMessage(value);
            validateJson(value);
          }}
          style={{ height: '100%' }}
        />
      </Box>

      <Button
        variant="solid"
        loading={publishing}
        disabled={!connected || !!error || !message.trim() || !topic.trim()}
        onClick={handlePublish}
      >
        Publish
      </Button>
    </Box>
  );
}
