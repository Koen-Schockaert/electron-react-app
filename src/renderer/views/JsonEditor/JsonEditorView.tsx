import { Box, Button, Typography, Alert } from '@mui/joy';
import { useEffect, useState } from 'react';
import { useMqtt } from '../../context/MqttContext';
import CodeMirror from '@uiw/react-codemirror';
//import 'codemirror/lib/codemirror.css';
//import 'codemirror/mode/javascript/javascript';


export default function JsonEditorView() {
  const { editorMessage, connected } = useMqtt();

  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!editorMessage) return;
    setTopic(editorMessage.topic);
    try {
      const parsed = JSON.parse(editorMessage.message);
      setMessage(JSON.stringify(parsed, null, 2));
    } catch {
      setMessage(editorMessage.message);
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
      sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Typography level="h4" mb={2}>
        JSON Editor
      </Typography>

      {error && (
        <Alert color="danger" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box mb={2}>
        <Typography level="body-sm">Topic</Typography>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{ width: '100%', height: 40 }}
        />
      </Box>

      <Box sx={{ flex: 1, mb: 2 }}>
        <Typography level="body-sm">Message</Typography>
        <CodeMirror
          value={message}
          extensions={[]}
          onChange={(value: string, viewUpdate?: any) => {
            setMessage(value);
            validateJson(value);
          }}
        />
      </Box>

      <Button
        variant="solid"
        loading={publishing}
        disabled={!connected}
        onClick={handlePublish}
      >
        Publish
      </Button>
    </Box>
  );
}
