import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/joy';
import { ContentPasteGo, FormatColorFill } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { EditorView, ViewPlugin, Decoration } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import { jsonExtensions } from './EditorTheme';
import { jsonErrorHighlighter } from './InvalidJsonHighlighter';

type Props = {
  filename?: string;
  initialValue?: string;
  onSave?: (content: string) => Promise<void> | void;
  readonly?: boolean;
  disableSave?: boolean;
  onChange?: (value: string) => void;
};

export type JsonEditorRef = {
  getValue: () => string;
};

export default forwardRef<JsonEditorRef, Props>(function JsonEditorReusable(
  { filename, initialValue = '', onSave, readonly = false, onChange, disableSave = false }: Props,
  ref,
) {
  const [message, setMessage] = useState(initialValue);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const isSearchFocused = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<{ message: string; position: number } | null>(null);

  useEffect(() => setMessage(initialValue), [initialValue]);

  const editorRef = useRef<EditorView | null>(null);
  const prevSearchRef = useRef<string>('');
  const [matches, setMatches] = useState<Array<{ from: number; to: number }>>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);

  useImperativeHandle(ref, () => ({
    getValue: () => message,
  }), [message]);

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
              if (match.index === re.lastIndex) re.lastIndex++;
            }
          }
          return builder.finish();
        }
      },
      { decorations: (v: any) => v.decorations },
    );
  };

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

  const doSave = async () => {
    if (!validateJson(message)) return;
    if (onSave) {
      await onSave(message);
      return;
    }
    // debug logs to help track why saves may fail
    console.log('JsonEditorReusable: attempting save', { filename, length: message.length });
    try {
      if ((window as any).filesAPI?.writeFile && filename) {
        const res = await (window as any).filesAPI.writeFile(filename, message);
        console.log('JsonEditorReusable: filesAPI.writeFile result', res);
        return;
      }
    } catch (e) {
      console.error('JsonEditorReusable: writeFile error', e);
    }
    // fallback download
    const blob = new Blob([message], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename ?? 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // keep search input focused when typing (avoid CodeMirror stealing focus)
  useEffect(() => {
    if (isSearchFocused.current) {
      const el = searchInputRef.current;
      if (el) {
        el.focus();
        const len = el.value.length;
        el.setSelectionRange(len, len);
      }
    }
  }, [searchTerm]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
        <Button variant="outlined" startDecorator={<FormatColorFill />} onClick={formatJson} disabled={!message.trim()}>
          Format JSON
        </Button>
        <Tooltip title="Copy to clipboard">
          <IconButton onClick={() => navigator.clipboard.writeText(message)}><ContentPasteGo /></IconButton>
        </Tooltip>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 0.5 }}>
          <SearchIcon />
          <input
            ref={searchInputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => { isSearchFocused.current = true; }}
            onBlur={() => { isSearchFocused.current = false; }}
            placeholder="Search in message..."
            style={{ background: 'transparent', border: '1px solid #1e293b', color: '#e5e7eb', padding: '4px 8px', borderRadius: 6, width: 220 }}
          />
          <IconButton onClick={() => setSearchTerm('')}><ClearIcon /></IconButton>
          <IconButton onClick={gotoPrev} disabled={!matches.length}><NavigateBeforeIcon /></IconButton>
          <Box sx={{ minWidth: 80, textAlign: 'center' }}>{matches.length ? `${currentMatchIndex + 1} / ${matches.length}` : '0 / 0'}</Box>
          <IconButton onClick={gotoNext} disabled={!matches.length}><NavigateNextIcon /></IconButton>
        </Box>

        {/* hide Save button entirely when disableSave is true */}
        {!disableSave && (
          <Button variant="solid" onClick={doSave} disabled={readonly} sx={{ ml: 1 }}>
            Save{filename ? ` (${filename})` : ''}
          </Button>
        )}
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', border: '1px solid #1e293b', borderRadius: 1, mb: 1, '.cm-search-match': { backgroundColor: 'rgba(250,224,66,0.25)', outline: '1px solid rgba(250,224,66,0.45)' } }}>
        <CodeMirror
          value={message}
          extensions={[json(), EditorView.lineWrapping, jsonExtensions, jsonErrorHighlighter(jsonError ? jsonError.position : null), searchHighlighter(searchTerm || null)]}
          onCreateEditor={(view) => (editorRef.current = view)}
          onChange={(value) => {
            setMessage(value);
            validateJson(value);
            if (onChange) onChange(value);
          }}
          editable={!readonly}
          style={{ height: '100%', backgroundColor: '#0f172a', color: '#e5e7eb', fontFamily: 'monospace' }}
        />
      </Box>
    </Box>
  );
});
