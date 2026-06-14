import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/joy';
import JsonEditorReusable from '../../../components/JsonEditorReusable';
// static fallbacks (used when filesAPI is not available)
import devicesBundled from '../../../data/devices.json';
import lqsBundled from '../../../data/lqs-devices.json';

type FileDef = { id: string; label: string };

export default function FileEditor() {
  const files: FileDef[] = [
    { id: 'devices.json', label: 'devices.json' },
    { id: 'lqs-devices.json', label: 'lqs-devices.json' },
  ];

  const [selected, setSelected] = useState<string>(files[0].id);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // save status: idle | saving | success | error
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const loadFile = async (id: string) => {
    setLoading(true);
    try {
      if ((window as any).filesAPI?.readFile) {
        const res = await (window as any).filesAPI.readFile(id);
        if (res && res.ok) {
          setContent(res.content);
          setLoading(false);
          return;
        } else {
          console.warn('FileEditor: readFile failed or not ok', res);
        }
      }
      // fallback to bundled imports
      if (id === 'devices.json') setContent(JSON.stringify(devicesBundled, null, 2));
      else if (id === 'lqs-devices.json') setContent(JSON.stringify(lqsBundled, null, 2));
    } catch (err) {
      console.error('FileEditor: loadFile error', err);
      if (id === 'devices.json') setContent(JSON.stringify(devicesBundled, null, 2));
      else setContent(JSON.stringify(lqsBundled, null, 2));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFile(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    let t: number | undefined;
    if (saveStatus === 'success' || saveStatus === 'error') {
      t = window.setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage(null);
      }, 3000);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [saveStatus]);

  const handleSave = async (newContent: string) => {
    try {
      setSaveStatus('saving');
      setSaveMessage('Saving...');
      console.log('FileEditor: saving', selected);
      if ((window as any).filesAPI?.writeFile) {
        const res = await (window as any).filesAPI.writeFile(selected, newContent);
        console.log('FileEditor: writeFile result', res);
        if (res && res.ok) {
          setSaveStatus('success');
          setSaveMessage('Saved successfully');
          // update current content so editor remains in sync
          setContent(newContent);
          return res;
        } else {
          setSaveStatus('error');
          setSaveMessage(res?.error ?? 'Save failed');
          return res;
        }
      } else {
        console.warn('FileEditor: filesAPI.writeFile not available, falling back to download.');
        setSaveStatus('error');
        setSaveMessage('Save API not available');
      }
    } catch (err: any) {
      console.error('FileEditor: save error', err);
      setSaveStatus('error');
      setSaveMessage(err?.message ?? 'Save error');
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, height: '540px' }}>
      <Box sx={{ width: 260, border: '1px solid #1e293b', borderRadius: 1, overflow: 'hidden' }}>
        <Box sx={{ p: 1, borderBottom: '1px solid #1e293b', color: '#9ca3af' }}>
          <Typography level="body2">JSON files</Typography>
        </Box>
        <Box>
          {files.map((f) => (
            <Box
              key={f.id}
              onClick={() => setSelected(f.id)}
              sx={{
                cursor: 'pointer',
                p: 1,
                borderBottom: '1px solid rgba(30,41,59,0.4)',
                bgcolor: selected === f.id ? 'rgba(56,189,248,0.06)' : 'transparent',
                color: '#e5e7eb',
              }}
            >
              {f.label}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {/* simple status area */}
        <Box sx={{ mb: 1, minHeight: 28 }}>
          {saveStatus === 'saving' && <Typography level="body3" sx={{ color: '#93c5fd' }}>{saveMessage}</Typography>}
          {saveStatus === 'success' && <Typography level="body3" sx={{ color: '#86efac' }}>{saveMessage}</Typography>}
          {saveStatus === 'error' && <Typography level="body3" sx={{ color: '#fca5a5' }}>{saveMessage}</Typography>}
        </Box>

        {!loading && (
          <JsonEditorReusable
            filename={selected}
            initialValue={content}
            onSave={handleSave}
          />
        )}
      </Box>
    </Box>
  );
}
