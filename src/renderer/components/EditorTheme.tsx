import { EditorView } from '@codemirror/view';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { json } from '@codemirror/lang-json';

const darkEditorTheme = EditorView.theme(
  {
    /* Root editor */
    '&.cm-editor': {
      backgroundColor: '#020617',
      color: '#e5e7eb',
      height: '100%',
    },

    /* Scroll container — THIS fixes white background */
    '.cm-scroller': {
      backgroundColor: '#020617',
      overflow: 'auto',
    },

    /* Text content */
    '.cm-content': {
      backgroundColor: '#020617',
      color: '#e5e7eb',
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      fontSize: '13px',
      caretColor: '#a5b4fc',
    },

    /* Gutters */
    '.cm-gutters': {
      backgroundColor: '#020617',
      color: '#64748b',
      borderRight: '1px solid #1e293b',
    },

    '.cm-lineNumbers': {
      minWidth: '32px',
    },

    /* Active line */
    '.cm-activeLine': {
      backgroundColor: 'rgba(148,163,184,0.06)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#020617',
    },

    /* Selection */
    '.cm-selectionBackground': {
      backgroundColor: 'rgba(99,102,241,0.25) !important',
      color: '#000 !important', // ensure selected text remains readable
    },

    '&.cm-focused .cm-selectionBackground': {
      backgroundColor: 'rgba(99,102,241,0.35) !important',
    },

    /* also style native selection inside the editor content */
    '.cm-content ::selection': {
      backgroundColor: '#334155',
      color: '#e5e7eb',
    },
    /* ensure active selection layer used by CM is clearly visible on dark bg */
    '.cm-selectionBackground, .cm-activeSelection': {
      backgroundColor: 'rgba(51,65,85,0.7) !important',
      color: '#e5e7eb !important',
    },

    /* Cursor */
    '.cm-cursor': {
      borderLeftColor: '#a5b4fc',
    },
  },
  { dark: true },
);

const jsonHighlightStyle = HighlightStyle.define([
  /* Keys */
  {
    tag: tags.propertyName,
    color: '#93c5fd', // light blue
    fontWeight: '500',
  },

  /* Strings */
  {
    tag: tags.string,
    color: '#a5b4fc', // indigo
  },

  /* Numbers */
  {
    tag: tags.number,
    color: '#fbbf24', // amber
  },

  /* Booleans + null */
  {
    tag: [tags.bool, tags.null],
    color: '#f472b6', // pink
    fontWeight: '500',
  },

  /* Punctuation: { } [ ] : , */
  {
    tag: tags.punctuation,
    color: '#94a3b8', // slate
  },

  /* Invalid JSON */
  {
    tag: tags.invalid,
    color: '#f87171',
    textDecoration: 'underline',
  },
]);

export const jsonExtensions = [
  json(),
  darkEditorTheme,
  syntaxHighlighting(jsonHighlightStyle),
  EditorView.lineWrapping,
];
