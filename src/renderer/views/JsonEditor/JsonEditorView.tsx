import React, { useEffect, useRef, useState } from 'react';
import { Box, Button } from '@mui/joy';
import PageLayout from '../../layout/PageLaout';
import { useMqtt } from '../../context/MqttContext';
import JsonEditorReusable, { JsonEditorRef } from '../../components/JsonEditorReusable';

export default function JsonEditorView() {
  const { editorMessage, connected } = useMqtt();
  const editorRef = useRef<JsonEditorRef | null>(null);

  const [topic, setTopic] = useState('');
  const [initialValue, setInitialValue] = useState('');

  useEffect(() => {
    if (!editorMessage) return;
    setTopic(editorMessage.topic);
    try {
      const parsed = JSON.parse(editorMessage.message);
      setInitialValue(JSON.stringify(parsed, null, 2));
    } catch {
      setInitialValue(editorMessage.message);
    }
  }, [editorMessage]);

  const handlePublish = async () => {
    if (!connected) return;
    const msg = editorRef.current?.getValue() ?? '';
    if (!topic.trim()) return;
    await window.mqttAPI.publish(topic, msg);
  };

  return (
    <PageLayout title="JSON Editor">
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* topic input + publish button (keep visible) */}
        <Box sx={{ mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic"
            style={{
              flex: 1,
              padding: '8px',
              background: '#071028',
              color: '#e5e7eb',
              border: '1px solid #1e293b',
              borderRadius: 6,
            }}
          />
          {/* Match MQTT view style */}
          <Button
            size="small"
            variant="contained"
            onClick={handlePublish}
            disabled={!connected || !topic.trim()}
            sx={{
              // match MQTT publish button: blue background, white text
              backgroundColor: '#2563eb',
              color: '#ffffff',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#1e40af' },
              '&.Mui-disabled': { opacity: 0.55 },
            }}
          >
            Publish
          </Button>
        </Box>

        {/* editor area (scrollable) */}
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <JsonEditorReusable
            ref={editorRef}
            initialValue={initialValue}
            filename={undefined}
            onSave={undefined}
            disableSave={true} // hide save button in this view
          />
        </Box>
      </Box>
    </PageLayout>
  );
}
