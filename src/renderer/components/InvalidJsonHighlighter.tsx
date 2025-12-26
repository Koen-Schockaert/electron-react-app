import { Decoration, EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view';

export function jsonErrorHighlighter(position: number | null) {
  if (position == null) return [];

  // clamp position >= 0
  const pos = Math.max(0, position);

  return ViewPlugin.fromClass(
    class {
      decorations: any;
      constructor(view: EditorView) {
        this.decorations = Decoration.set([
          Decoration.mark({ class: 'cm-json-error' }).range(pos, pos + 1),
        ]);
      }
      update(update: ViewUpdate) {}
    },
    {
      decorations: (v) => v.decorations,
    }
  );
}
