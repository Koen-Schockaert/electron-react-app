import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, IconButton, Alert, Tooltip } from '@mui/joy';
import { ContentPasteGo, FormatColorFill } from '@mui/icons-material';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView, ViewPlugin, Decoration } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useMqtt } from '../../context/MqttContext';
import { DarkTextField } from '../../components/form/LabeledTextField';
import PageLayout from '../../layout/PageLaout';
import { jsonExtensions } from '../../components/EditorTheme';
import { jsonErrorHighlighter } from '../../components/InvalidJsonHighlighter';

export default function JsonEditorView() {
  const { editorMessage, connected } = useMqtt();
  const [searchTerm, setSearchTerm] = useState('');

  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [jsonError, setJsonError] = useState<{ message: string; position: number } | null>(null);

  const editorRef = useRef<EditorView | null>(null);
  // remember previous search term so we only auto-focus on "start search"
  const prevSearchRef = useRef<string>('');

  // matches state: array of { from, to }
  const [matches, setMatches] = useState<Array<{ from: number; to: number }>>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);

  // simple view plugin to highlight search matches (visible ranges)
  const searchHighlighter = (term: string | null) => {
    if (!term) return [];
    const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(esc, 'gi');

    return ViewPlugin.fromClass(
      class {
        decorations: any;
        constructor(view: any) {
          this.decorations = this.buildDeco(view);
        }
        update(update: any) {
          if (update.docChanged || update.viewportChanged) {
            this.decorations = this.buildDeco(update.view);
          }
        }
        buildDeco(view: any) {
          const builder = new RangeSetBuilder<Decoration>();
          for (const range of view.visibleRanges) {
            const text = view.state.doc.sliceString(range.from, range.to);
            let match;
            while ((match = re.exec(text))) {
              const from = range.from + match.index;
              const to = from + match[0].length;
              builder.add(from, to, Decoration.mark({ class: 'cm-search-match' }));
              // prevent infinite loop for empty match
              if (match.index === re.lastIndex) re.lastIndex++;
            }
          }
          return builder.finish();
        }
      },
      { decorations: (v: any) => v.decorations },
    );
  };

  // compute matches array whenever searchTerm or message changes
  useEffect(() => {
    if (!searchTerm) {
      setMatches([]);
      setCurrentMatchIndex(0);
      prevSearchRef.current = '';
      return;
    }
    const esc = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(esc, 'gi');
    const found: Array<{ from: number; to: number }> = [];
    let match;
    while ((match = re.exec(message))) {
      const from = match.index;
      const to = from + match[0].length;
      found.push({ from, to });
      if (match.index === re.lastIndex) re.lastIndex++;
    }
    setMatches(found);
    setCurrentMatchIndex(found.length ? 0 : 0);

    // only auto-scroll / focus when search is started (previous term was empty)
    if (found.length && editorRef.current && prevSearchRef.current === '') {
      const pos = found[0].from;
      editorRef.current.dispatch({
        selection: { anchor: pos, head: found[0].to },
        scrollIntoView: true,
      });
      editorRef.current.focus();
    }

    // update prev search term
    prevSearchRef.current = searchTerm;
  }, [searchTerm, message]);

  const gotoMatch = (index: number) => {
    if (!matches.length || !editorRef.current) return;
    const idx = ((index % matches.length) + matches.length) % matches.length;
    const m = matches[idx];
    editorRef.current.dispatch({
      selection: { anchor: m.from, head: m.to },
      scrollIntoView: true,
    });
    editorRef.current.focus();
    setCurrentMatchIndex(idx);
  };

  const gotoNext = () => gotoMatch(currentMatchIndex + 1);
  const gotoPrev = () => gotoMatch(currentMatchIndex - 1);

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

          {/* Search field and navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 0.5 }}>
            <SearchIcon sx={{ color: '#9ca3af' }} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in message..."
              style={{
                background: 'transparent',
                border: '1px solid #1e293b',
                color: '#e5e7eb',
                padding: '4px 8px',
                borderRadius: 6,
                width: 220,
              }}
            />
            <IconButton size="sm" onClick={() => setSearchTerm('')} sx={{ color: '#9ca3af' }}>
              <ClearIcon />
            </IconButton>

            {/* Prev / Count / Next */}
            <IconButton
              size="sm"
              onClick={gotoPrev}
              disabled={!matches.length}
              sx={{ color: '#9ca3af' }}
              title="Previous match"
            >
              <NavigateBeforeIcon />
            </IconButton>

            <Box sx={{ color: '#9ca3af', fontSize: 13, minWidth: 80, textAlign: 'center' }}>
              {matches.length ? `${currentMatchIndex + 1} / ${matches.length}` : '0 / 0'}
            </Box>

            <IconButton
              size="sm"
              onClick={gotoNext}
              disabled={!matches.length}
              sx={{ color: '#9ca3af' }}
              title="Next match"
            >
              <NavigateNextIcon />
            </IconButton>
          </Box>
        </Box>

        {/* ===== TOPIC INPUT (FIXED) ===== */}
        <Box mb={2} flexShrink={0}>
          <DarkTextField label="Topic" value={topic} onChange={setTopic} placeholder="Enter MQTT topic" disabled={publishing} />
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
              backgroundColor: 'rgba(220, 38, 38, 0.3)',
            },
            '.cm-search-match': {
              backgroundColor: 'rgba(250,224,66,0.25)',
              outline: '1px solid rgba(250,224,66,0.45)',
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
              searchHighlighter(searchTerm || null),
            ]}
            onCreateEditor={(view) => {
              editorRef.current = view;
            }}
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
          <Button variant="solid" disabled={!connected || !!error || !message.trim() || !topic.trim()} onClick={handlePublish} sx={{ width: 120 }}>
            Publish
          </Button>
        </Box>
      </Box>
    </PageLayout>
  );
}
